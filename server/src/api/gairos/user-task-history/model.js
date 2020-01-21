const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTaskHistory",
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
      googleEventId: {
        type: DataTypes.STRING,
        nullable: true
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
    models.userTaskHistory.belongsTo(models.task);
  };

  return Model;
};

export default model;
