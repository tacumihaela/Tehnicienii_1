const express = require("express");
const router = express.Router();
const { projects } = require("../controllers");

router.post("/", projects.createProject);
router.get("/", projects.getAll);
router.post("/add", projects.addToProject);
router.post("/deliverables", projects.updateDeliverable);
router.get("/deliverables", projects.getDeliverables);

module.exports = router;
