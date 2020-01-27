const model = (sequelize, DataTypes) => {
  const Model = sequelize.define("tag", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  });

  Model.associate = models => {
    models.tag.belongsToMany(models.user, {
      through: models.userTag,
      foreignKey: "tagId",
      onDelete: "NO ACTION"
    });
    models.tag.hasOne(models.userTag, {
      foreignKey: "tagId",
      as: "userTagInfo",
      onDelete: "NO ACTION"
    });
  };

  return Model;
};
export default model;
