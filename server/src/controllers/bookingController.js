const { Booking } = require("../models");
const { bookingCreateNew, paymentConfirm } = require("../utils/validators");
const { createBooking, processPayment } = require('../services/bookingService');

exports.list = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    // Usuxbook links users to bookings
    const { Usuxbook, Booking } = require('../models');
    const links = await Usuxbook.findAll({ where: { user_id: user.id } });
    const bookIds = links.map(l => l.book_id);
    const rows = bookIds.length ? await Booking.findAll({ where: { id: bookIds } }) : [];
    res.json({ message: "ok", data: { data: rows }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Booking.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = bookingCreateNew.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { flight_id, passengers } = value;
    const userId = req.user ? req.user.id : null;

    const result = await createBooking({ flightId: flight_id, passengers, userId });
    if (result.error) return res.status(result.error.includes('Máximo') ? 400 : 409).json({ error: result.error });

    res.status(201).json({
      message: "Reserva creada exitosamente",
      data: {
        booking: result.booking,
        passengers: result.passengers,
        seats: result.seats
      },
      status: 201
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await Booking.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Booking not found" });
    await row.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { error, value } = paymentConfirm.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { booking_id, payment_data } = value;
    const userId = req.user ? req.user.id : null;

    const result = await processPayment({ bookingId: booking_id, paymentData: payment_data, userId });
    if (result.error) return res.status(400).json({ error: result.error });

    res.json({
      message: "Reserva confirmada exitosamente",
      data: {
        booking: result.booking,
        invoice: result.invoice,
        tickets: result.tickets,
        total_amount: result.totalAmount,
        confirmation_code: result.confirmationCode
      },
      status: 200
    });
  } catch (err) {
    next(err);
  }
};
