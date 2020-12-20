module.exports = function (sequelize, DataTypes) {
  return sequelize.define("grade", {
    value: DataTypes.FLOAT,
  });
};
