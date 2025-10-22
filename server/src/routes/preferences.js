const express = require('express');
const router = express.Router();
const controller = require('../controllers/preferencesController');
const { protect } = require('../middleware/authJwt');

router.get('/:userId', protect, controller.getByUser);
router.put('/:userId', protect, controller.update);

module.exports = router;
