module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      lastname: { type: DataTypes.STRING, allowNull: false },
      snd_lastname: { type: DataTypes.STRING, allowNull: false },
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
      tableName: "user",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    // Some models may be added later (passengers). Guard association calls.
    if (models.Passenger) {
      User.hasMany(models.Passenger, { foreignKey: 'user_id' });
    }
    if (models.Passengers) {
      User.hasMany(models.Passengers, { foreignKey: 'user_id' });
    }
  };

  return User;
};
