const express = require("express");
const router = express.Router();
const leadController = require("../controllers/lead.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", leadController.getLeads);
router.get("/stats", authorize("ADMIN"), leadController.getStats);
router.get("/export/excel", authorize("ADMIN"), leadController.exportAssignedLeads);
router.post("/assign", authorize("ADMIN"), leadController.assignLeads);
router.patch("/:id/status", leadController.updateLeadStatus);

module.exports = router;
