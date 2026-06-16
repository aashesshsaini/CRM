const express = require("express");
const router = express.Router();
const scraperController = require("../controllers/scraper.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.post(
  "/google-maps",
  authenticate,
  authorize("ADMIN"),
  scraperController.scrapeLeads,
);

module.exports = router;
