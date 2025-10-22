const { sequelize, FlightXSeat, Seat, Passenger, Booking, Ticket } = require('../models');

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 50;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function bookSeat({ flightId, seatId, passengerData, userId, bookingNotes }) {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    attempt += 1;
    const t = await sequelize.transaction();
    try {
      // Lock the seat row to prevent concurrent assignment
      const seat = await Seat.findOne({ where: { id: seatId }, transaction: t, lock: t.LOCK.UPDATE });
      if (!seat) {
        await t.rollback();
        return { error: 'Seat not found' };
      }

      // Check existing flightxseat for this flight+seat
      const existing = await FlightXSeat.findOne({
        where: { flight_id: flightId, seat_id: seatId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (existing && existing.occupied) {
        await t.rollback();
        return { error: 'Seat already occupied' };
      }

      let fxseat;
      if (existing) {
        fxseat = await existing.update({ occupied: true }, { transaction: t });
      } else {
        fxseat = await FlightXSeat.create({ flight_id: flightId, seat_id: seatId, occupied: true }, { transaction: t });
      }

      const passenger = await Passenger.create({
        names: passengerData.names,
        lastname: passengerData.lastname,
        snd_lastname: passengerData.snd_lastname,
        birthday: passengerData.birthday,
        gender: passengerData.gender,
        doc_type: passengerData.doc_type,
        doc_num: passengerData.doc_num,
        phone: passengerData.phone,
        email: passengerData.email,
        user_id: userId || null,
      }, { transaction: t });

      await fxseat.update({ customer_id: passenger.id }, { transaction: t });

      const booking = await Booking.create({ flight_id: flightId, date: new Date(), status: 'ok', notes: bookingNotes || '', created_at: new Date() }, { transaction: t });

      const ticket = await Ticket.create({ pass_id: passenger.id, book_id: booking.id, fxseat_id: fxseat.id }, { transaction: t });

      await t.commit();
      return { success: true, booking, ticket, passenger, fxseat };
    } catch (err) {
      try { await t.rollback(); } catch (e) { /* ignore */ }

      // Retry for serialization failures or deadlocks
      const sqlState = err && err.parent && err.parent.code;
      const isSerialization = sqlState === '40001' || sqlState === '40P01';
      const isUnique = err && err.name === 'SequelizeUniqueConstraintError';

      if ((isSerialization || isUnique) && attempt < MAX_RETRIES) {
        await delay(RETRY_BASE_MS * Math.pow(2, attempt));
        continue;
      }

      throw err;
    }
  }

  throw new Error('Could not complete booking after retries');
}

module.exports = { bookSeat };
