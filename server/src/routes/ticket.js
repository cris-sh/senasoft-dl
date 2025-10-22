const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');
const { protect } = require('../middleware/authJwt');

router.get('/', protect, controller.list);
router.get('/:id', protect, controller.get);
router.post('/', protect, controller.create);

module.exports = router;
