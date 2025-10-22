module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    plane_id: { type: DataTypes.BIGINT, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    add_price: { type: DataTypes.DECIMAL, allowNull: false },
  }, {
    tableName: 'seats',
    timestamps: false,
  });

  Seat.associate = (models) => {
    if (models.Planes) Seat.belongsTo(models.Planes, { foreignKey: 'plane_id' });
  };

  return Seat;
};
