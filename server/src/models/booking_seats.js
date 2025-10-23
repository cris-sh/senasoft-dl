module.exports = (sequelize, DataTypes) => {
  const BookingSeat = sequelize.define('BookingSeat', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.BIGINT, allowNull: true },
    passenger_id: { type: DataTypes.BIGINT, allowNull: false },
    seat_number: { type: DataTypes.STRING, allowNull: false },
    checkin: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'booking_seats',
    timestamps: false,
  });

  BookingSeat.associate = (models) => {
    if (models.Booking) BookingSeat.belongsTo(models.Booking, { foreignKey: 'booking_id' });
    if (models.Passenger) BookingSeat.belongsTo(models.Passenger, { foreignKey: 'passenger_id' });
    if (models.Ticket) BookingSeat.hasOne(models.Ticket, { foreignKey: 'booking_seat_id' });
  };

  return BookingSeat;
};