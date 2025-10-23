const { logger } = require("../utils/logger");

exports.errorHandler = (err, req, res, next) => {
  // Log detallado del error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user ? req.user.id : 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Determinar código de estado
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Manejo específico de errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Datos de entrada inválidos';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Conflicto de datos únicos';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Referencia a datos inexistentes';
  } else if (err.name === 'SequelizeConnectionError') {
    status = 503;
    message = 'Error de conexión a la base de datos';
  }

  // Respuesta estructurada
  res.status(status).json({
    error: {
      message,
      code: status,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
};
