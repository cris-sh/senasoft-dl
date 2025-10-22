module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    state_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'city',
    timestamps: false,
  });

  City.associate = (models) => {
    if (models.State) City.belongsTo(models.State, { foreignKey: 'state_id' });
  };

  return City;
};
