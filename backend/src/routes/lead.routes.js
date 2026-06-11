const express = require("express");
const router = express.Router();

const leadController = require("../controllers/lead.controller");

router.get("/", leadController.getLeads);
router.post("/assign", leadController.assignLeads);
router.patch("/:id/status", leadController.updateLeadStatus);
router.get("/export/excel", leadController.exportAssignedLeads);
router.get("/stats", leadController.getStats);

module.exports = router;
