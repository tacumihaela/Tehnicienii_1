const sequelize = require("../config/db");

const User = sequelize.import("./user");
const Project = sequelize.import("./project");
const Grade = sequelize.import("./grade");

const Deliverable = sequelize.import("./deliverable");
const UserDeliverables = sequelize.import("./userDeliverables");

Project.hasMany(User, { onDelete: "Cascade" });
User.hasMany(Grade, { onDelete: "Cascade" });

Project.hasMany(Deliverable, { onDelete: "Cascade" });

Deliverable.hasMany(Grade, { onDelete: "Cascade" });
Deliverable.hasMany(UserDeliverables, { onDelete: "Cascade" });
User.hasMany(UserDeliverables, { onDelete: "Cascade" });

module.exports = { User, Deliverable, Project, Grade, sequelize };
