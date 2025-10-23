const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { logger, morganStream } = require("../utils/logger");
const authRoutes = require("../routes/auth");
const { errorHandler } = require("../middleware/errorHandler");
require("../auth/passport");

const flightsRoutes = require('../routes/flights');
const airportsRoutes = require('../routes/airports');
const planesRoutes = require('../routes/planes');
const seatsRoutes = require('../routes/seats');
const bookingRoutes = require('../routes/booking');
const passengersRoutes = require('../routes/passengers');
const ticketRoutes = require('../routes/ticket');
const invoiceRoutes = require('../routes/invoice');
const preferencesRoutes = require('../routes/preferences');
const mailRoutes = require('../routes/mail');
const seedRoutes = require('../routes/seed');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: morganStream }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use('/api/flights', flightsRoutes);
app.use('/api/airports', airportsRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/passengers', passengersRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/seed', seedRoutes);

app.get('/api/health', async (req, res) => {
  const sequelize = require('../config/database');
  try {
    await sequelize.authenticate();
    res.json({ ok: true, db: 'ok' });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

app.get("/", (req, res) => res.json({ ok: true, name: "AirFly API" }));

app.use(errorHandler);

module.exports = app;
