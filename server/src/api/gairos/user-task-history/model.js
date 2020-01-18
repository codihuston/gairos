const model = (sequelize, DataTypes) => {
  const Model = sequelize.define("userTaskHistory", {
    userTaskId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.DATE,
      nullable: false
    },
    endTime: {
      type: DataTypes.DATE,
      nullable: true
    }
  });

  Model.associate = models => {
    models.userTaskHistory.belongsTo(models.userTask);
  };

  return Model;
};

export default model;
11;
