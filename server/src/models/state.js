module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    country_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'state',
    timestamps: false,
  });

  State.associate = (models) => {
    if (models.Country) State.belongsTo(models.Country, { foreignKey: 'country_id' });
  };

  return State;
};
