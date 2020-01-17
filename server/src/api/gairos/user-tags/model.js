const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTag",
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      tagId: {
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
          fields: ["userId", "tagId"]
        }
      ]
    }
  );

  return Model;
};
export default model;
