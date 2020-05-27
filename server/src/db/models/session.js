const model = (sequelize, DataTypes) => {
  const Session = sequelize.define("session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.STRING(50000)
  });
  return Session;
};
export default model;
