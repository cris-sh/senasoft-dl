module.exports = (sequelize, DataTypes) => {
  const Preferences = sequelize.define('Preferences', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    theme: { type: DataTypes.STRING, allowNull: true, defaultValue: 'dark' },
    updated_at: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'preferences',
    timestamps: false,
  });

  Preferences.associate = (models) => {
    if (models.User) Preferences.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Preferences;
};
