require("dotenv").config();
const app = require("./config/app");
const { logger } = require("./utils/logger");

const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection OK');

    if (process.env.NODE_ENV === 'development') {
      if (process.env.DB_SYNC === 'true') {
        logger.info('DB_SYNC=true -> running sequelize.sync({ alter: true })');
        await sequelize.sync({ alter: true });
        logger.info('Sequelize sync complete');
      }
    }

    app.listen(PORT, () => {
      logger.info(`AirFly server running on port ${PORT}`);
    });
  } catch (err) {
    // Do not exit the process here - allow the server to start in degraded mode.
    logger.warn('Database connection failed at startup: ' + err.message);
    logger.warn('Starting server without successful DB connection. Some endpoints will fail until DB is available.');

    // Start server anyway so development can continue.
    app.listen(PORT, () => {
      logger.info(`AirFly server running on port ${PORT} (DB not connected)`);
    });
  }
}

start();

