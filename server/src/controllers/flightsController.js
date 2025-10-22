const { Flight } = require('../models');
const { flightCreate, flightUpdate } = require('../utils/validators');

exports.list = async (req, res, next) => {
  try {
    const flights = await Flight.findAll();
    res.json({ data: flights });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json({ data: flight });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = flightCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const flight = await Flight.create(value);
    res.status(201).json({ data: flight });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { error, value } = flightUpdate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    await flight.update(value);
    res.json({ data: flight });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    await flight.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
