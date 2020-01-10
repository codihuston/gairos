const model = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.message, { onDelete: "CASCADE" });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });

    return user;
  };

  return User;
};
export default model;
