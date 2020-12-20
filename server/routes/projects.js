const express = require("express");
const router = express.Router();
const { projects } = require("../controllers");

router.post("/", projects.createProject);
router.get("/", projects.getAll);
router.post("/add", projects.addToProject);
router.post("/deliverables", projects.createDeliverable);
router.get("/deliverables", projects.getDeliverables);
router.get("/prof", projects.getAllAsProf);

module.exports = router;
