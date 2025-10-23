const { Flight, Airport, Planes } = require("../models");
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
        const { departure_airport, arrival_airport, date, passengers } = req.query;

        let whereClause = {};

        // Filtros por fecha si se proporciona
        if (date) {
            whereClause.date = date;
        }

        // Convertir códigos de aeropuerto a IDs si se proporcionan
        if (departure_airport) {
            const depAirport = await Airport.findOne({ where: { code: departure_airport } });
            if (depAirport) {
                whereClause.departure_airport = depAirport.id;
            } else {
                return res.status(400).json({ error: "Aeropuerto de salida no encontrado" });
            }
        }

        if (arrival_airport) {
            const arrAirport = await Airport.findOne({ where: { code: arrival_airport } });
            if (arrAirport) {
                whereClause.arrival_airport = arrAirport.id;
            } else {
                return res.status(400).json({ error: "Aeropuerto de llegada no encontrado" });
            }
        }

        // Consulta básica de vuelos con includes para aeropuertos
        const flights = await Flight.findAll({
            where: whereClause,
            include: [
                { model: Airport, as: 'DepartureAirport', attributes: ['code', 'name', 'city'] },
                { model: Airport, as: 'ArrivalAirport', attributes: ['code', 'name', 'city'] }
            ]
        });

        // Para cada vuelo, calcular asientos disponibles
        const flightsWithAvailability = flights.map((flight) => {
            const availableSeats = 100; // Valor fijo por ahora
            const totalSeats = 100;

            // Verificar si hay suficientes asientos para los pasajeros
            const hasEnoughSeats = passengers ? parseInt(passengers) <= availableSeats : true;

            return {
                id: flight.id,
                plane_id: flight.plane_id,
                departure_airport: flight.DepartureAirport.code,
                arrival_airport: flight.ArrivalAirport.code,
                departure_airport_name: flight.DepartureAirport.name,
                arrival_airport_name: flight.ArrivalAirport.name,
                departure_city: flight.DepartureAirport.city,
                arrival_city: flight.ArrivalAirport.city,
                dep_time: flight.dep_time,
                arr_time: flight.arr_time,
                date: flight.date,
                price: flight.price,
                available_seats: availableSeats,
                total_seats: totalSeats,
                has_enough_seats: hasEnoughSeats,
            };
        });

        // Filtrar vuelos que no tienen suficientes asientos
        const filteredFlights = passengers
            ? flightsWithAvailability.filter((flight) => flight.has_enough_seats)
            : flightsWithAvailability;

        res.json({
            message: "ok",
            data: { data: filteredFlights },
            status: 200,
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
        res.status(201).json({ message: "ok", data: { data: flight }, status: 201 });
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
