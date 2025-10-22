module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    book_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    doc_type: { type: DataTypes.STRING, allowNull: false },
    num_doc: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    pay_method: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
  }, {
    tableName: 'invoice',
    timestamps: false,
  });

  Invoice.associate = (models) => {
    if (models.Booking) Invoice.belongsTo(models.Booking, { foreignKey: 'book_id' });
    if (models.User) Invoice.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Invoice;
};
