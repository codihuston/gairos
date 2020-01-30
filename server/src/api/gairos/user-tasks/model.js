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
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      foregroundColor: {
        type: DataTypes.STRING,
        defaultValue: "#ffffff",
        nullable: true
      },
      backgroundColor: {
        type: DataTypes.STRING,
        defaultValue: "#5B89C9",
        nullable: true
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: false,
          fields: ["userId", "taskId"]
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
    models.userTask.hasOne(models.userTaskTag, {
      foreignKey: "userTaskId"
    });
    models.userTask.belongsTo(models.task, {
      foreignKey: "taskId"
    });
    models.userTask.hasMany(models.userTaskHistory, {
      foreignKey: "userTaskId",
      as: "taskHistory",
      onDelete: "CASCADE"
    });
  };

  return Model;
};
export default model;
