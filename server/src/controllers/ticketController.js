const { Ticket } = require('../models');
const { ticketCreate } = require('../utils/validators');

exports.list = async (req, res, next) => {
  try {
    const rows = await Ticket.findAll();
    res.json({ data: rows });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = ticketCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const row = await Ticket.create(value);
    res.status(201).json({ data: row });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try { const row = await Ticket.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'Ticket not found' }); res.json({ data: row }); } catch (err) { next(err); }
};
