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
        allowNull: false
      },
      userTaskId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["userTagId", "userTaskId"]
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
    models.userTaskTag.belongsTo(models.userTask, {
      foreignKey: "userTaskId",
      as: "userTaskInfo",
      onDelete: "cascade"
    });
  };

  return Model;
};
export default model;
