const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.use(authenticate, authorize("ADMIN"));

router.post("/", agentController.createAgent);
router.get("/", agentController.getAgents);
router.delete("/:id", agentController.deleteAgent);

module.exports = router;
