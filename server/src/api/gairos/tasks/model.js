const model = (sequelize, DataTypes) => {
  const Model = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  });

  Model.associate = models => {
    models.task.belongsToMany(models.user, {
      through: models.userTask,
      foreignKey: "taskId",
      unique: false
    });
    models.task.hasMany(models.userTaskHistory, {
      foreignKey: "taskId",
      as: "taskHistory"
    });
    models.task.hasOne(models.userTask, {
      foreignKey: "taskId",
      as: "userTaskInfo"
    });
  };

  return Model;
};
export default model;
