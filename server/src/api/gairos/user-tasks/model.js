const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTask",
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      taskId: {
        type: DataTypes.UUID,
        primaryKey: true
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

  return Model;
};
export default model;
