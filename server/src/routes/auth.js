const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require('../middleware/authJwt');

router.post("/register", authController.register);
router.post(
  "/login",
  authController.login
);

router.get('/me', protect, authController.me);

module.exports = router;
