const { Airports } = require("../models");
const { airportCreate, airportUpdate } = require("../utils/validators");

exports.list = async (req, res, next) => {
  try {
    const rows = await Airports.findAll();
    res.json({ message: "ok", data: { data: rows }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Airports.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Airport not found" });
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = airportCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Airports.create(value);
    res.status(201).json({ message: "ok", data: { data: row }, status: 201 });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = airportUpdate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Airports.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Airport not found" });
    await row.update(value);
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await Airports.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Airport not found" });
    await row.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
