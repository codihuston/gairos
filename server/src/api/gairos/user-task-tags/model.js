const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTaskTag",
    {
      userTagId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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

  Model.associate = models => {};

  return Model;
};
export default model;
