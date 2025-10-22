module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define(
    "Airports",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      icao: { type: DataTypes.STRING, allowNull: false, unique: true },
      city_id: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      tableName: "airports",
      timestamps: false,
    }
  );

  Airport.associate = (models) => {
    // associations can be added here
  };

  return Airport;
};
