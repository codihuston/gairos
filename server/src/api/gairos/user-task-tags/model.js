const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTaskTag",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userTagId: {
        type: DataTypes.UUID,
        nullable: false
      },
      taskId: {
        type: DataTypes.UUID,
        nullable: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userTagId", "taskId"]
        }
      ]
    }
  );

  Model.associate = models => {
    models.userTaskTag.belongsTo(models.task, {
      foreginKey: "taskId"
    });
  };

  return Model;
};
export default model;
