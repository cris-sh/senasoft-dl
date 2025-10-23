module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    flight_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'reserved' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'bookings',
    timestamps: false,
  });

  Booking.associate = (models) => {
    if (models.User) Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    if (models.Flight) Booking.belongsTo(models.Flight, { foreignKey: 'flight_id' });
    if (models.BookingSeat) Booking.hasMany(models.BookingSeat, { foreignKey: 'booking_id' });
    if (models.Invoice) Booking.hasMany(models.Invoice, { foreignKey: 'booking_id' });
  };

  return Booking;
};
