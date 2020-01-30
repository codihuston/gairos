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
      eventHexColorCode: {
        type: DataTypes.STRING,
        defaultValue: "#5B89C9",
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
      paranoid: true,
      indexes: [
        {
          unique: false,
          fields: ["userTaskId"]
        }
      ],
      defaultScope: {
        where: {
          deletedAt: null
        }
      }
    }
  );

  Model.associate = models => {
    models.userTaskHistory.belongsTo(models.userTask, {
      foreignKey: "userTaskId",
      as: "userTaskInfo",
      onDelete: "CASCADE"
    });
  };

  return Model;
};

export default model;
