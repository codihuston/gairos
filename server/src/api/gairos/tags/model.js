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
      foreignKey: "tagId"
    });
  };

  return Model;
};
export default model;
