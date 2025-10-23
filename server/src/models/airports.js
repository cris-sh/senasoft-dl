module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define(
    "Airport",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      tableName: "airports",
      timestamps: false,
    }
  );

  Airport.associate = (models) => {
    if (models.Flight) {
      Airport.hasMany(models.Flight, { foreignKey: 'departure_airport' });
      Airport.hasMany(models.Flight, { foreignKey: 'arrival_airport' });
    }
  };

  return Airport;
};
