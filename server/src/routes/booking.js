const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const { protect } = require('../middleware/authJwt');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', protect, controller.create);
router.delete('/:id', protect, controller.remove);

module.exports = router;
