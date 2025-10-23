const { sequelize, BookingSeat, Seat, Passenger, Booking, Ticket, Invoice } = require('../models');
const logger = require('../utils/logger').logger;

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 50;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Simular proceso de pago
async function simulatePayment(amount) {
  // Simulación simple: 90% de éxito
  const success = Math.random() > 0.1;
  await delay(1000); // Simular tiempo de procesamiento
  return success;
}

// Crear reserva completa con transacción
async function createBooking({ flightId, passengers, userId }) {
  const t = await sequelize.transaction();
  try {
    // Validar máximo 5 pasajeros
    if (passengers.length > 5) {
      await t.rollback();
      return { error: 'Máximo 5 pasajeros permitidos por reserva' };
    }

    // Verificar que no haya asientos duplicados en la solicitud
    const seatIds = passengers.map(p => p.seat_id);
    if (new Set(seatIds).size !== seatIds.length) {
      await t.rollback();
      return { error: 'No se pueden seleccionar asientos duplicados' };
    }

    // Crear booking con estado 'pending'
    const booking = await Booking.create({
      user_id: userId,
      flight_id: flightId,
      date: new Date(),
      status: 'reserved',
      notes: '',
      created_at: new Date()
    }, { transaction: t });

    // Nota: Asociación usuario-booking simplificada por ahora

    const passengersData = [];
    const flightSeats = [];

    // Crear pasajeros y asignar asientos específicos
    for (let i = 0; i < passengers.length; i++) {
      const passengerData = passengers[i];

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
        is_child: passengerData.is_child || false
      }, { transaction: t });

      // Crear asiento para este pasajero
      const seat = await BookingSeat.create({
        booking_id: booking.id,
        passenger_id: passenger.id,
        seat_number: passengerData.seat_id.toString(),
        checkin: false
      }, { transaction: t });

      passengersData.push(passenger);
      flightSeats.push(seat);
    }

    await t.commit();

    return {
      success: true,
      booking,
      passengers: passengersData,
      seats: flightSeats
    };

  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    logger.error('Error creando reserva:', err);
    return { error: 'Error interno del servidor' };
  }
}

// Procesar pago y confirmar reserva
async function processPayment({ bookingId, paymentData, userId }) {
  const t = await sequelize.transaction();
  try {
    // Obtener booking
    const booking = await Booking.findByPk(bookingId, { transaction: t });
    if (!booking || booking.status !== 'pending') {
      await t.rollback();
      return { error: 'Reserva no encontrada o ya procesada' };
    }

    // Calcular monto total (precio del vuelo * número de pasajeros)
    const passengersCount = await Passenger.count({
      include: [{
        model: Booking,
        where: { id: bookingId }
      }],
      transaction: t
    });

    const { Flight } = require('../models');
    const flight = await Flight.findByPk(booking.flight_id, { transaction: t });
    const totalAmount = flight.price * passengersCount;

    // Simular pago
    const paymentSuccess = await simulatePayment(totalAmount);

    if (!paymentSuccess) {
      // Pago fallido - eliminar registros de booking_seats
      await BookingSeat.destroy({
        where: { booking_id: bookingId },
        transaction: t
      });

      await booking.update({ status: 'failed' }, { transaction: t });
      await t.commit();

      return { error: 'Pago rechazado' };
    }

    // Pago exitoso - crear invoice
    const invoice = await Invoice.create({
      book_id: bookingId,
      user_id: userId,
      name: paymentData.name,
      doc_type: paymentData.doc_type,
      num_doc: paymentData.num_doc,
      email: paymentData.email,
      phone: paymentData.phone,
      description: `Pago por reserva de vuelo - ${passengersCount} pasajero(s)`,
      pay_method: paymentData.pay_method,
      amount: totalAmount
    }, { transaction: t });

    // Actualizar booking a confirmado
    await booking.update({ status: 'confirmed' }, { transaction: t });

    // Crear tickets
    const ticketsData = await Ticket.findAll({
      where: { book_id: bookingId },
      transaction: t
    });

    if (ticketsData.length === 0) {
      // Si no existen tickets, crearlos
      const passengers = await Passenger.findAll({
        include: [{
          model: Booking,
          where: { id: bookingId }
        }],
        transaction: t
      });

      for (const passenger of passengers) {
        const bookingSeat = await BookingSeat.findOne({
          where: { booking_id: bookingId, passenger_id: passenger.id },
          transaction: t
        });

        if (bookingSeat) {
          await Ticket.create({
            pass_id: passenger.id,
            book_id: bookingId,
            fxseat_id: bookingSeat.id
          }, { transaction: t });
        }
      }
    }

    await t.commit();

    // Obtener datos completos para respuesta
    const confirmedBooking = await Booking.findByPk(bookingId, {
      include: [
        { model: Flight, as: 'Flight' },
        {
          model: Passenger,
          as: 'Passengers',
          through: { attributes: [] }
        }
      ]
    });

    const tickets = await Ticket.findAll({
      where: { book_id: bookingId },
      include: [
        { model: Passenger, as: 'Passenger' },
        { model: BookingSeat, as: 'BookingSeat' }
      ]
    });

    return {
      success: true,
      booking: confirmedBooking,
      invoice,
      tickets,
      totalAmount,
      confirmationCode: `CONF-${bookingId}-${Date.now()}`
    };

  } catch (err) {
    await t.rollback();
    logger.error('Error procesando pago:', err);
    return { error: 'Error interno del servidor' };
  }
}

module.exports = { createBooking, processPayment };
