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
      unique: false,
      onDelete: "NO ACTION"
    });
    models.task.hasOne(models.userTask, {
      foreignKey: "taskId",
      as: "userTaskInfo",
      onDelete: "NO ACTION"
    });
  };

  return Model;
};
export default model;
