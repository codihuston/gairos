const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTaskHistory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userTaskId: {
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
          fields: ["userTaskId"]
        }
      ]
    }
  );

  Model.associate = models => {
    models.userTaskHistory.belongsTo(models.userTask, {
      foreignKey: "userTaskId",
      as: "userTaskInfo"
    });
  };

  return Model;
};

export default model;
