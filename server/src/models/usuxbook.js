module.exports = (sequelize, DataTypes) => {
  const Usuxbook = sequelize.define('Usuxbook', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    book_id: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: 'usuxbook',
    timestamps: false,
  });

  Usuxbook.associate = (models) => {
    if (models.User) Usuxbook.belongsTo(models.User, { foreignKey: 'user_id' });
    if (models.Booking) Usuxbook.belongsTo(models.Booking, { foreignKey: 'book_id' });
  };

  return Usuxbook;
};
