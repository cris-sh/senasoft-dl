module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    "Flight",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      plane_id: { type: DataTypes.BIGINT, allowNull: false },
      departure: { type: DataTypes.BIGINT, allowNull: false },
      arrival: { type: DataTypes.BIGINT, allowNull: false },
      dep_time: { type: DataTypes.DATE, allowNull: false },
      arr_time: { type: DataTypes.DATE, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
    },
    {
      tableName: "flights",
      timestamps: false,
    }
  );

  Flight.associate = (models) => {
    Flight.belongsTo(models.Planes, { foreignKey: "plane_id" });
  };

  return Flight;
};
