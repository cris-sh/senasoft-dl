const { Invoice } = require("../models");
const { invoiceCreate } = require("../utils/validators");

exports.create = async (req, res, next) => {
  try {
    const { error, value } = invoiceCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Invoice.create(value);
    res.status(201).json({ message: "ok", data: { data: row }, status: 201 });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Invoice.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Invoice not found" });
    res.json({ message: "ok", data: { data: row }, status: 200 });
  } catch (err) {
    next(err);
  }
};
