const Joi = require('joi');

const flightCreate = Joi.object({
  plane_id: Joi.number().integer().required(),
  departure: Joi.number().integer().required(),
  arrival: Joi.number().integer().required(),
  dep_time: Joi.date().iso().required(),
  arr_time: Joi.date().iso().required(),
  date: Joi.date().iso().required(),
  price: Joi.number().precision(2).required(),
});

const flightUpdate = Joi.object({
  plane_id: Joi.number().integer(),
  departure: Joi.number().integer(),
  arrival: Joi.number().integer(),
  dep_time: Joi.date().iso(),
  arr_time: Joi.date().iso(),
  date: Joi.date().iso(),
  price: Joi.number().precision(2),
});

const airportCreate = Joi.object({
  name: Joi.string().required(),
  icao: Joi.string().required(),
  city_id: Joi.number().integer().required(),
});

const airportUpdate = Joi.object({
  name: Joi.string(),
  icao: Joi.string(),
  city_id: Joi.number().integer(),
});

const planeCreate = Joi.object({
  model: Joi.string().required(),
  capacity: Joi.number().integer().required(),
  plate: Joi.string().required(),
  status: Joi.string().allow('', null),
});

const planeUpdate = Joi.object({
  model: Joi.string(),
  capacity: Joi.number().integer(),
  plate: Joi.string(),
  status: Joi.string().allow('', null),
});

const seatCreate = Joi.object({
  plane_id: Joi.number().integer().required(),
  code: Joi.string().required(),
  type: Joi.string().required(),
  add_price: Joi.number().precision(2).required(),
});

const seatUpdate = Joi.object({
  plane_id: Joi.number().integer(),
  code: Joi.string(),
  type: Joi.string(),
  add_price: Joi.number().precision(2),
});

const bookingCreate = Joi.object({
  flight_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
});

const passengerCreate = Joi.object({
  names: Joi.string().required(),
  lastname: Joi.string().required(),
  snd_lastname: Joi.string().required(),
  birthday: Joi.date().iso().required(),
  gender: Joi.string().required(),
  doc_type: Joi.string().required(),
  doc_num: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  is_child: Joi.boolean().optional(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  user_id: Joi.number().integer().required(),
});

const bookingCreateNew = Joi.object({
  flight_id: Joi.number().integer().required(),
  passengers: Joi.array().items(
    Joi.object({
      names: Joi.string().required(),
      lastname: Joi.string().required(),
      snd_lastname: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      gender: Joi.string().required(),
      doc_type: Joi.string().required(),
      doc_num: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      is_child: Joi.boolean().optional(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      seat_id: Joi.number().integer().required(),
    })
  ).min(1).max(5).required(),
});

const paymentConfirm = Joi.object({
  booking_id: Joi.number().integer().required(),
  payment_data: Joi.object({
    name: Joi.string().required(),
    doc_type: Joi.string().required(),
    num_doc: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    pay_method: Joi.string().valid('credit_card', 'debit_card', 'bank_transfer', 'cash').required(),
  }).required(),
});

const passengerUpdate = Joi.object({
  names: Joi.string(),
  lastname: Joi.string(),
  snd_lastname: Joi.string(),
  birthday: Joi.date().iso(),
  gender: Joi.string(),
  doc_type: Joi.string(),
  doc_num: Joi.alternatives().try(Joi.string(), Joi.number()),
  is_child: Joi.boolean(),
  phone: Joi.string(),
  email: Joi.string().email(),
  user_id: Joi.number().integer(),
});

module.exports = {
  flightCreate,
  flightUpdate,
  airportCreate,
  airportUpdate,
  planeCreate,
  planeUpdate,
  seatCreate,
  seatUpdate,
  bookingCreate,
  passengerCreate,
  passengerUpdate,
};

// Ticket / Invoice / Preferences validators
const ticketCreate = Joi.object({
  pass_id: Joi.number().integer().required(),
  book_id: Joi.number().integer().required(),
  fxseat_id: Joi.number().integer().required(),
});

const invoiceCreate = Joi.object({
  book_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  doc_type: Joi.string().required(),
  num_doc: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  description: Joi.string().required(),
  pay_method: Joi.string().required(),
  amount: Joi.number().precision(2).required(),
});

const preferencesUpdate = Joi.object({
  theme: Joi.string().valid('dark', 'light').optional(),
});

module.exports = Object.assign(module.exports, {
  ticketCreate,
  invoiceCreate,
  preferencesUpdate,
  bookingCreateNew,
  paymentConfirm,
});
