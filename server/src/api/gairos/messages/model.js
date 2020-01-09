const model = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: {
      type: DataTypes.STRING
    }
  });
  Message.associate = models => {
    Message.belongsTo(models.user);
  };
  return Message;
};
export default model;
