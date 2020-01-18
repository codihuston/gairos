const model = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    googleId: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    isFirstSetupCompleted: {
      type: DataTypes.STRING
    },
    calendarId: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    models.user.hasMany(models.message, { onDelete: "CASCADE" });

    models.user.belongsToMany(models.task, {
      through: models.userTask,
      foreignKey: "userId",
      unique: false
    });
    models.user.belongsToMany(models.tag, {
      through: models.userTag,
      foreignKey: "userId"
    });
    models.user.belongsToMany(models.task, {
      through: models.userTaskHistory,
      foreignKey: "userId",
      // Note: alias affects the name of the magic methods via Sequelize
      as: "taskHistory",
      unique: false
    });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });
    if (!user) {
      // user = await User.findOne({
      //   where: { email: login }
      // });
    }
    return user;
  };

  return User;
};
export default model;
