module.exports = (sequelize, DataTypes) => {
  const Planes = sequelize.define('Planes', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    model: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.SMALLINT, allowNull: false },
    plate: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'planes',
    timestamps: false,
  });

  Planes.associate = (models) => {
    Planes.hasMany(models.Flight, { foreignKey: 'plane_id' });
  };

  return Planes;
};
