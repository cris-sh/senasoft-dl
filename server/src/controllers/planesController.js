const { Planes } = require("../models");
const { planeCreate, planeUpdate } = require("../utils/validators");

exports.list = async (req, res, next) => {
  try {
    const rows = await Planes.findAll();
    res.json({ message: "ok", data: { data: rows }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Planes.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Plane not found" });
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = planeCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Planes.create(value);
    res.status(201).json({ message: "ok", data: { data: row }, status: 201 });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = planeUpdate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Planes.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Plane not found" });
    await row.update(value);
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const row = await Planes.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Plane not found" });
    await row.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
