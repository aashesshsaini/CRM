const express = require("express");
const router = express.Router();

const scraperController = require("../controllers/scraper.controller");

router.post("/google-maps", scraperController.scrapeLeads);

module.exports = router;
