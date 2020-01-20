const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTask",
    {
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
        type: DataTypes.BOOLEAN
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
    models.userTask.belongsTo(models.task, {
      foreignKey: "taskId"
    });
  };

  return Model;
};
export default model;
