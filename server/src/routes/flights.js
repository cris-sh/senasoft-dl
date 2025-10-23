const express = require('express');
const router = express.Router();
const controller = require('../controllers/flightsController');
const { protect } = require('../middleware/authJwt');

router.get('/', controller.list);
router.get('/available', controller.available);
router.get('/:id', controller.get);
router.post('/', protect, controller.create);
router.put('/:id', protect, controller.update);
router.delete('/:id', protect, controller.remove);

module.exports = router;
