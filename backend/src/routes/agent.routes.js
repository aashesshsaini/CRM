const express = require("express");
const router = express.Router();

const agentController = require("../controllers/agent.controller");

router.post("/", agentController.createAgent);
router.get("/", agentController.getAgents);

module.exports = router;
