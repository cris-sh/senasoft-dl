module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    booking_seat_id: { type: DataTypes.BIGINT, allowNull: false },
    ticket_code: { type: DataTypes.STRING, allowNull: false, unique: true },
    issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'tickets',
    timestamps: false,
  });

  Ticket.associate = (models) => {
    if (models.BookingSeat) Ticket.belongsTo(models.BookingSeat, { foreignKey: 'booking_seat_id' });
  };

  return Ticket;
};
