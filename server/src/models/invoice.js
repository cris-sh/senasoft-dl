module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    pay_method: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'invoices',
    timestamps: false,
  });

  Invoice.associate = (models) => {
    if (models.Booking) Invoice.belongsTo(models.Booking, { foreignKey: 'booking_id' });
    if (models.User) Invoice.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Invoice;
};
