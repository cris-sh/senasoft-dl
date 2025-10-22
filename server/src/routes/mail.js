const express = require('express');
const router = express.Router();
const { sendMail, templateCheckin, templateConfirmation } = require('../utils/mail');
const { logger } = require('../utils/logger');

router.post('/send', async (req, res, next) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ ok: false, error: 'to, subject and (text or html) are required' });
  }
  try {
    const info = await sendMail({ to, subject, text, html });
    res.json({ ok: true, info });
  } catch (err) {
    logger.warn('Mail send failed: ' + err.message);
    next(err);
  }
});

router.post('/checkin', async (req, res, next) => {
  const {
    to,
    passengerName,
    flightNumber,
    seat,
    departure,
    arrival,
    date,
    depTime,
    arrTime,
    ticketCode,
  } = req.body;

  if (!to || !passengerName || !flightNumber) {
    return res.status(400).json({ ok: false, error: 'to, passengerName and flightNumber are required' });
  }
  logger.info(`POST /api/mail/checkin body=${JSON.stringify(req.body)}`);
  try {
    const { subject, text, html } = templateCheckin({
      passengerName,
      flightNumber,
      seat,
      departure,
      arrival,
      date,
      depTime,
      arrTime,
      ticketCode,
    });
    const info = await sendMail({ to, subject, text, html });
    const response = { ok: true, info };
    if (process.env.NODE_ENV !== 'production') {
      response.preview = { subject, text, html };
    }
    res.json(response);
  } catch (err) {
    logger.warn('Mail checkin failed: ' + err.message);
    next(err);
  }
});

router.post('/confirmation', async (req, res, next) => {
  const { to, passengerName, bookingRef, amount, flightNumber, seat, ticketCode, departure, arrival, date } = req.body;
  if (!to || !passengerName || !bookingRef) {
    return res.status(400).json({ ok: false, error: 'to, passengerName and bookingRef are required' });
  }
  logger.info(`POST /api/mail/confirmation body=${JSON.stringify(req.body)}`);
  try {
    const { subject, text, html } = templateConfirmation({ passengerName, bookingRef, amount, flightNumber, seat, ticketCode, departure, arrival, date });
    const info = await sendMail({ to, subject, text, html });
    const response = { ok: true, info };
    if (process.env.NODE_ENV !== 'production') {
      response.preview = { subject, text, html };
    }
    res.json(response);
  } catch (err) {
    logger.warn('Mail confirmation failed: ' + err.message);
    next(err);
  }
});

module.exports = router;
