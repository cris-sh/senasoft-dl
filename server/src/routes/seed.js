const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../utils/seed');

// POST /api/seed - Seed the database
router.post('/', async (req, res) => {
  try {
    await seedDatabase();
    res.json({
      message: 'ok',
      data: { message: 'Database seeded successfully' },
      status: 200
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({
      message: 'error',
      data: { error: error.message },
      status: 500
    });
  }
});

module.exports = router;