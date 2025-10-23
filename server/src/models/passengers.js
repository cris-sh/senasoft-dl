module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    names: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    snd_lastname: { type: DataTypes.STRING, allowNull: false },
    doc_type: { type: DataTypes.STRING, allowNull: false },
    doc_num: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    is_child: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'passengers',
    timestamps: false,
  });

  Passenger.associate = (models) => {
    if (models.User) Passenger.belongsTo(models.User, { foreignKey: 'user_id' });
    if (models.BookingSeat) Passenger.hasMany(models.BookingSeat, { foreignKey: 'passenger_id' });
  };

  return Passenger;
};
