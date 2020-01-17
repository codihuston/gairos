const model = (sequelize, DataTypes) => {
  const Model = sequelize.define("userTaskHistory", {
    userTaskId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    models.userTaskHistory.hasOne(models.userTask);
  };

  return Model;
};

export default model;
