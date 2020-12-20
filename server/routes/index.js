const express = require("express");
const router = express.Router();

const gradesRouter = require("./grades");
const resetRouter = require("./reset");
const authRouter = require("./auth");
const projectsRouter = require("./projects");

const { checkLogin } = require("../controllers").auth.middleware;

router.use("/grades", checkLogin, gradesRouter);
router.use("/projects", checkLogin, projectsRouter);
router.use("/reset", resetRouter);
router.use("/", authRouter);

module.exports = router;
