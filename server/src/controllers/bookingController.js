const { Booking } = require("../models");
const { bookingCreate } = require("../utils/validators");
const { bookSeat } = require('../services/bookingService');

exports.list = async (req, res, next) => {
  try {
    const rows = await Booking.findAll();
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
    const { error, value } = bookingCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    // expected value: { flight_id, seat_id, passenger, notes }
    const { flight_id, seat_id, passenger, notes } = value;
    const userId = req.user ? req.user.id : null;

    const result = await bookSeat({ flightId: flight_id, seatId: seat_id, passengerData: passenger, userId, bookingNotes: notes });
    if (result.error) return res.status(409).json({ error: result.error });

    res.status(201).json({ message: "ok", data: { data: result }, status: 201 });
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
