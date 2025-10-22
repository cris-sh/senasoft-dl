module.exports = (sequelize, DataTypes) => {
  const FlightXSeat = sequelize.define('FlightXSeat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    flight_id: { type: DataTypes.BIGINT, allowNull: false },
    seat_id: { type: DataTypes.BIGINT, allowNull: false },
    customer_id: { type: DataTypes.BIGINT, allowNull: true },
    occupied: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  }, {
    tableName: 'flightxseats',
    timestamps: false,
  });

  FlightXSeat.associate = (models) => {
    if (models.Flight) FlightXSeat.belongsTo(models.Flight, { foreignKey: 'flight_id' });
    if (models.Seat) FlightXSeat.belongsTo(models.Seat, { foreignKey: 'seat_id' });
    if (models.Passenger) FlightXSeat.belongsTo(models.Passenger, { foreignKey: 'customer_id' });
  };

  return FlightXSeat;
};
