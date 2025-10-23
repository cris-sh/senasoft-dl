const sequelize = require('../config/database');
const { Flight, Airports, Planes, Seats } = require('../models');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in correct order (respecting foreign keys)
    await Flight.destroy({ where: {} });
    await Seats.destroy({ where: {} });
    await Planes.destroy({ where: {} });
    await Airports.destroy({ where: {} });

    // Seed Airports
    const airports = await Airports.bulkCreate([
      { name: 'El Dorado', city: 'Bogotá', code: 'BOG' },
      { name: 'José María Córdova', city: 'Medellín', code: 'MDE' },
      { name: 'Matecaña', city: 'Pereira', code: 'PEI' },
      { name: 'Ernesto Cortissoz', city: 'Barranquilla', code: 'BAQ' },
      { name: 'Rafael Núñez', city: 'Cartagena', code: 'CTG' },
      { name: 'Alfonso Bonilla Aragón', city: 'Cali', code: 'CLO' }
    ]);
    console.log('✅ Airports seeded');

    // Seed Planes
    const planes = await Planes.bulkCreate([
      { model: 'Airbus A320', capacity: 180, plate: 'ABC123' },
      { model: 'Boeing 737-800', capacity: 189, plate: 'DEF456' },
      { model: 'Airbus A319', capacity: 156, plate: 'GHI789' },
      { model: 'Boeing 737-700', capacity: 149, plate: 'JKL012' }
    ]);
    console.log('✅ Planes seeded');

    // Seed Seats for each plane
    for (const plane of planes) {
      const seats = [];
      for (let row = 1; row <= Math.ceil(plane.capacity / 6); row++) {
        for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
          if (seats.length < plane.capacity) {
            seats.push({
              plane_id: plane.id,
              seat_number: `${row}${letter}`,
              class: 'economy',
              add_price: 0
            });
          }
        }
      }
      await Seats.bulkCreate(seats);
    }
    console.log('✅ Seats seeded');

    // Seed Flights for today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const flightData = [
      // Bogotá to Medellín - Today
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '06:00', arr_time: '07:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '08:00', arr_time: '09:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '10:00', arr_time: '11:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '12:00', arr_time: '13:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '14:00', arr_time: '15:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '16:00', arr_time: '17:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '18:00', arr_time: '19:00', price: 150000, date: today },
      { plane_id: 1, departure_airport: 1, arrival_airport: 2, dep_time: '20:00', arr_time: '21:00', price: 150000, date: today },

      // Medellín to Bogotá - Today
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '07:30', arr_time: '08:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '09:30', arr_time: '10:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '11:30', arr_time: '12:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '13:30', arr_time: '14:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '15:30', arr_time: '16:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '17:30', arr_time: '18:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '19:30', arr_time: '20:30', price: 150000, date: today },
      { plane_id: 1, departure_airport: 2, arrival_airport: 1, dep_time: '21:30', arr_time: '22:30', price: 150000, date: today },

      // Bogotá to Pereira - Today
      { plane_id: 3, departure_airport: 1, arrival_airport: 3, dep_time: '07:00', arr_time: '08:15', price: 120000, date: today },
      { plane_id: 3, departure_airport: 1, arrival_airport: 3, dep_time: '11:00', arr_time: '12:15', price: 120000, date: today },
      { plane_id: 3, departure_airport: 1, arrival_airport: 3, dep_time: '15:00', arr_time: '16:15', price: 120000, date: today },
      { plane_id: 3, departure_airport: 1, arrival_airport: 3, dep_time: '19:00', arr_time: '20:15', price: 120000, date: today },

      // Pereira to Bogotá - Today
      { plane_id: 3, departure_airport: 3, arrival_airport: 1, dep_time: '08:45', arr_time: '10:00', price: 120000, date: today },
      { plane_id: 3, departure_airport: 3, arrival_airport: 1, dep_time: '12:45', arr_time: '14:00', price: 120000, date: today },
      { plane_id: 3, departure_airport: 3, arrival_airport: 1, dep_time: '16:45', arr_time: '18:00', price: 120000, date: today },
      { plane_id: 3, departure_airport: 3, arrival_airport: 1, dep_time: '20:45', arr_time: '22:00', price: 120000, date: today },

      // Bogotá to Barranquilla - Today
      { plane_id: 2, departure_airport: 1, arrival_airport: 4, dep_time: '06:30', arr_time: '08:00', price: 180000, date: today },
      { plane_id: 2, departure_airport: 1, arrival_airport: 4, dep_time: '12:30', arr_time: '14:00', price: 180000, date: today },
      { plane_id: 2, departure_airport: 1, arrival_airport: 4, dep_time: '18:30', arr_time: '20:00', price: 180000, date: today },

      // Barranquilla to Bogotá - Today
      { plane_id: 2, departure_airport: 4, arrival_airport: 1, dep_time: '09:00', arr_time: '10:30', price: 180000, date: today },
      { plane_id: 2, departure_airport: 4, arrival_airport: 1, dep_time: '15:00', arr_time: '16:30', price: 180000, date: today },
      { plane_id: 2, departure_airport: 4, arrival_airport: 1, dep_time: '21:00', arr_time: '22:30', price: 180000, date: today },

      // Tomorrow flights (same schedule, higher prices)
      // Bogotá to Medellín - Tomorrow
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '06:00', arr_time: '07:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '08:00', arr_time: '09:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '10:00', arr_time: '11:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '12:00', arr_time: '13:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '14:00', arr_time: '15:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '16:00', arr_time: '17:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '18:00', arr_time: '19:00', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 1, arrival_airport: 2, dep_time: '20:00', arr_time: '21:00', price: 160000, date: tomorrow },

      // Medellín to Bogotá - Tomorrow
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '07:30', arr_time: '08:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '09:30', arr_time: '10:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '11:30', arr_time: '12:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '13:30', arr_time: '14:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '15:30', arr_time: '16:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '17:30', arr_time: '18:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '19:30', arr_time: '20:30', price: 160000, date: tomorrow },
      { plane_id: 2, departure_airport: 2, arrival_airport: 1, dep_time: '21:30', arr_time: '22:30', price: 160000, date: tomorrow },

      // Bogotá to Pereira - Tomorrow
      { plane_id: 4, departure_airport: 1, arrival_airport: 3, dep_time: '07:00', arr_time: '08:15', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 1, arrival_airport: 3, dep_time: '11:00', arr_time: '12:15', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 1, arrival_airport: 3, dep_time: '15:00', arr_time: '16:15', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 1, arrival_airport: 3, dep_time: '19:00', arr_time: '20:15', price: 130000, date: tomorrow },

      // Pereira to Bogotá - Tomorrow
      { plane_id: 4, departure_airport: 3, arrival_airport: 1, dep_time: '08:45', arr_time: '10:00', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 3, arrival_airport: 1, dep_time: '12:45', arr_time: '14:00', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 3, arrival_airport: 1, dep_time: '16:45', arr_time: '18:00', price: 130000, date: tomorrow },
      { plane_id: 4, departure_airport: 3, arrival_airport: 1, dep_time: '20:45', arr_time: '22:00', price: 130000, date: tomorrow },

      // Bogotá to Barranquilla - Tomorrow
      { plane_id: 1, departure_airport: 1, arrival_airport: 4, dep_time: '06:30', arr_time: '08:00', price: 190000, date: tomorrow },
      { plane_id: 1, departure_airport: 1, arrival_airport: 4, dep_time: '12:30', arr_time: '14:00', price: 190000, date: tomorrow },
      { plane_id: 1, departure_airport: 1, arrival_airport: 4, dep_time: '18:30', arr_time: '20:00', price: 190000, date: tomorrow },

      // Barranquilla to Bogotá - Tomorrow
      { plane_id: 1, departure_airport: 4, arrival_airport: 1, dep_time: '09:00', arr_time: '10:30', price: 190000, date: tomorrow },
      { plane_id: 1, departure_airport: 4, arrival_airport: 1, dep_time: '15:00', arr_time: '16:30', price: 190000, date: tomorrow },
      { plane_id: 1, departure_airport: 4, arrival_airport: 1, dep_time: '21:00', arr_time: '22:30', price: 190000, date: tomorrow }
    ];

    // Create flights with proper timestamps
    const flightsToCreate = flightData.map(flight => ({
      ...flight,
      dep_time: new Date(`${flight.date.toISOString().split('T')[0]}T${flight.dep_time}:00`),
      arr_time: new Date(`${flight.date.toISOString().split('T')[0]}T${flight.arr_time}:00`),
      type: 'ida'
    }));

    await Flight.bulkCreate(flightsToCreate);
    console.log('✅ Flights seeded');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:
    - ${airports.length} airports
    - ${planes.length} planes
    - Seats created for all planes
    - ${flightsToCreate.length} flights (today and tomorrow)
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

module.exports = { seedDatabase };