const { Sequelize } = require('sequelize');
const logger = require('../utils/logger').logger;

const databaseUrl = process.env.DATABASE_URL;

let sequelize;
if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
  });
} else {
  sequelize = new Sequelize('sqlite::memory:', { logging: (msg) => logger.debug(msg) });
}

module.exports = sequelize;
