module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'country',
    timestamps: false,
  });

  Country.associate = (models) => {
    // associations
  };

  return Country;
};
