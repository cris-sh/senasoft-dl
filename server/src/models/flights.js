module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    "Flight",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      plane_id: { type: DataTypes.BIGINT, allowNull: false },
      departure_airport: { type: DataTypes.BIGINT, allowNull: false },
      arrival_airport: { type: DataTypes.BIGINT, allowNull: false },
      dep_time: { type: DataTypes.DATE, allowNull: false },
      arr_time: { type: DataTypes.DATE, allowNull: false },
      type: { type: DataTypes.STRING, defaultValue: 'ida' },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      tableName: "flights",
      timestamps: false,
    }
  );

  Flight.associate = (models) => {
    if (models.Plane) Flight.belongsTo(models.Plane, { foreignKey: "plane_id" });
    if (models.Airport) {
      Flight.belongsTo(models.Airport, { foreignKey: "departure_airport", as: "DepartureAirport" });
      Flight.belongsTo(models.Airport, { foreignKey: "arrival_airport", as: "ArrivalAirport" });
    }
    if (models.Booking) Flight.hasMany(models.Booking, { foreignKey: 'flight_id' });
  };

  return Flight;
};
