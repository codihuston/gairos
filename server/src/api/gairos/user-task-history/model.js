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
      eventId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      eventColorId: {
        type: DataTypes.STRING,
        defaultValue: "1",
        allowNull: false
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true
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
