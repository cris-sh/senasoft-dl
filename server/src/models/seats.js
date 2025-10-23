module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    plane_id: { type: DataTypes.BIGINT, allowNull: false },
    seat_number: { type: DataTypes.STRING, allowNull: false },
    class: { type: DataTypes.STRING, defaultValue: 'economy' },
    add_price: { type: DataTypes.DECIMAL, defaultValue: 0 },
  }, {
    tableName: 'seats',
    timestamps: false,
  });

  Seat.associate = (models) => {
    if (models.Plane) Seat.belongsTo(models.Plane, { foreignKey: 'plane_id' });
  };

  return Seat;
};
