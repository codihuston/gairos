const model = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "userTag",
    {
      id: {
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
          unique: true,
          fields: ["userId", "tagId"]
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
    models.userTag.hasMany(models.userTaskTag, {
      foreignKey: {
        name: "userTagId",
        allowNull: true
      }
    });
    models.userTag.belongsTo(models.tag, {
      foreignKey: "tagId"
    });
  };

  return Model;
};
export default model;
