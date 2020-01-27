const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTask",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID
      },
      taskId: {
        type: DataTypes.UUID
      },
      description: {
        type: DataTypes.STRING
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      indexes: [
        {
          unique: false,
          fields: ["userId", "taskId"]
        }
      ]
    }
  );

  Model.associate = models => {
    models.userTask.hasOne(models.userTaskTag, {
      foreignKey: "userTaskId"
    });
    models.userTask.belongsTo(models.task, {
      foreignKey: "taskId"
    });
  };

  return Model;
};
export default model;
