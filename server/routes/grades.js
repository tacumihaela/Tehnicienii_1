const express = require("express");
const router = express.Router();
const { grade } = require("../controllers");

router.put("/", grade.giveGrade);
router.get("/", grade.getGrades);

module.exports = router;
