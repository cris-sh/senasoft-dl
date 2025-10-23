const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const { protect } = require('../middleware/authJwt');

// List bookings - if user is authenticated return only their bookings
router.get('/', protect, controller.list);
router.get('/:id', protect, controller.get);
router.post('/', protect, controller.create);
router.post('/confirm', protect, controller.confirm);
router.delete('/:id', protect, controller.remove);

module.exports = router;
