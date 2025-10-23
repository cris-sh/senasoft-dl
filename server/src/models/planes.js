module.exports = (sequelize, DataTypes) => {
  const Plane = sequelize.define('Plane', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    model: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.SMALLINT, allowNull: false },
    plate: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
  }, {
    tableName: 'planes',
    timestamps: false,
  });

  Plane.associate = (models) => {
    if (models.Flight) Plane.hasMany(models.Flight, { foreignKey: 'plane_id' });
    if (models.Seat) Plane.hasMany(models.Seat, { foreignKey: 'plane_id' });
  };

  return Plane;
};
