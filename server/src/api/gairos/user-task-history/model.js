const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTaskHistory",
    {
      userId: {
        type: DataTypes.UUID
      },
      taskId: {
        type: DataTypes.UUID
      },
      startTime: {
        type: DataTypes.DATE,
        nullable: false
      },
      endTime: {
        type: DataTypes.DATE,
        nullable: true
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
    models.userTaskHistory.belongsTo(models.task, {
      foreignKey: "taskId"
    });
  };

  return Model;
};

export default model;
