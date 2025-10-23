module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      lastname: { type: DataTypes.STRING, allowNull: false },
      snd_lastname: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      birthday: { type: DataTypes.DATEONLY, allowNull: false },
      gender: { type: DataTypes.STRING, allowNull: false },
      doc_type: { type: DataTypes.STRING, allowNull: false },
      doc_num: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    if (models.Passenger) {
      User.hasMany(models.Passenger, { foreignKey: 'user_id' });
    }
    if (models.Booking) {
      User.hasMany(models.Booking, { foreignKey: 'user_id' });
    }
    if (models.Invoice) {
      User.hasMany(models.Invoice, { foreignKey: 'user_id' });
    }
  };

  return User;
};
