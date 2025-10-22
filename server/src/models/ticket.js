module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pass_id: { type: DataTypes.BIGINT, allowNull: false },
    book_id: { type: DataTypes.BIGINT, allowNull: false },
    fxseat_id: { type: DataTypes.BIGINT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    check_in: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    code: { type: DataTypes.UUID, allowNull: true, defaultValue: DataTypes.UUIDV4 },
  }, {
    tableName: 'ticket',
    timestamps: false,
  });

  Ticket.associate = (models) => {
    if (models.Passenger) Ticket.belongsTo(models.Passenger, { foreignKey: 'pass_id' });
    if (models.Booking) Ticket.belongsTo(models.Booking, { foreignKey: 'book_id' });
    if (models.FlightXSeat) Ticket.belongsTo(models.FlightXSeat, { foreignKey: 'fxseat_id' });
  };

  return Ticket;
};
