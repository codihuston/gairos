const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTag",
    {
      userTagId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID
      },
      tagId: {
        type: DataTypes.UUID
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
          unique: true,
          fields: ["userId", "tagId"]
        }
      ]
    }
  );

  Model.associate = models => {
    models.userTag.belongsTo(models.tag);
    // models.userTag.hasOne(models.userTaskTag, {
    models.userTag.hasMany(models.userTaskTag, {
      foreignKey: {
        name: "userTagId",
        allowNull: true
      }
    });
  };

  return Model;
};
export default model;
