const { Booking } = require('../models');
const { bookingCreate } = require('../utils/validators');

exports.list = async (req, res, next) => {
  try {
    const rows = await Booking.findAll();
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Booking.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = bookingCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Booking.create(value);
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await Booking.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    await row.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
