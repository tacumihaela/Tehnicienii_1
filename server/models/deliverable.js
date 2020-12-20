module.exports = function (sequelize, DataTypes) {
  return sequelize.define("deliverable", {
    source: DataTypes.STRING,
  });
};
