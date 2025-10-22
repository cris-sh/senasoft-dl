module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    flight_id: { type: DataTypes.BIGINT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true, defaultValue: 'ok' },
    notes: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
    created_at: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'booking',
    timestamps: false,
  });

  Booking.associate = (models) => {
    if (models.Flight) Booking.belongsTo(models.Flight, { foreignKey: 'flight_id' });
    if (models.Invoice) Booking.hasOne(models.Invoice, { foreignKey: 'book_id' });
  };

  return Booking;
};
