const { Flight, Airports, Planes } = require("../models");
const { flightCreate, flightUpdate } = require("../utils/validators");

exports.list = async (req, res, next) => {
  try {
    const flights = await Flight.findAll();
    res.json({ message: "ok", data: { data: flights }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.available = async (req, res, next) => {
  try {
    const { departure_city, arrival_city, departure_country, arrival_country, date } = req.query;

    let whereClause = {};

    // Filtros por fecha si se proporciona
    if (date) {
      whereClause.date = date;
    }

    // Consulta básica de vuelos
    const flights = await Flight.findAll({
      where: whereClause
    });

    // Filtrar por ciudad si se proporcionan (simplificado sin includes)
    let filteredFlights = flights;

    // Nota: Filtros por país deshabilitados temporalmente debido a estructura de BD
    // if (departure_country) {
    //   filteredFlights = filteredFlights.filter(f =>
    //     f.departure_airport?.City?.State?.Country?.name?.toLowerCase().includes(departure_country.toLowerCase())
    //   );
    // }

    // if (arrival_country) {
    //   filteredFlights = filteredFlights.filter(f =>
    //     f.arrival_airport?.City?.State?.Country?.name?.toLowerCase().includes(arrival_country.toLowerCase())
    //   );
    // }

    // Para cada vuelo, calcular asientos disponibles
    const flightsWithAvailability = filteredFlights.map(flight => {
      const availableSeats = 100; // Valor fijo por ahora
      const totalSeats = 100;

      return {
        id: flight.id,
        plane_id: flight.plane_id,
        departure_airport: flight.departure_airport,
        arrival_airport: flight.arrival_airport,
        dep_time: flight.dep_time,
        arr_time: flight.arr_time,
        date: flight.date,
        price: flight.price,
        available_seats: availableSeats,
        total_seats: totalSeats
      };
    });

    res.json({
      message: "ok",
      data: { data: flightsWithAvailability },
      status: 200
    });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.json({ message: "ok", data: { data: flight }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = flightCreate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const flight = await Flight.create(value);
    res
      .status(201)
      .json({ message: "ok", data: { data: flight }, status: 201 });
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
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    await flight.update(value);
    res.json({ message: "ok", data: { data: flight }, status: 200 });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    await flight.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
