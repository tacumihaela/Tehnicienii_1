const express = require("express");
const router = express.Router();
const { grade } = require("../controllers");

router.put("/", grade.giveGrade);
router.get("/", grade.getGrades);
router.get("/prof", grade.getAllAsProf);

module.exports = router;
