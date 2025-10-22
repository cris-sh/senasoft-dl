module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    names: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    snd_lastname: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    doc_type: { type: DataTypes.STRING, allowNull: false },
    doc_num: { type: DataTypes.BIGINT, allowNull: false },
    is_child: { type: DataTypes.BOOLEAN, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: 'passengers',
    timestamps: false,
  });

  Passenger.associate = (models) => {
    if (models.User) Passenger.belongsTo(models.User, { foreignKey: 'user_id' });
    if (models.Ticket) Passenger.hasMany(models.Ticket, { foreignKey: 'pass_id' });
    if (models.FlightXSeat) Passenger.hasMany(models.FlightXSeat, { foreignKey: 'customer_id' });
  };

  return Passenger;
};
