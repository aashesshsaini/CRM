const {
  scrapeSingleQuery,
  saveScrapedLeads,
} = require("../services/googleMapsScraper.service");

exports.scrapeLeads = async (req, res) => {
  try {
    const { query, maxLeads = 100 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "query is required",
      });
    }

    const leads = await scrapeSingleQuery(query, Number(maxLeads));
    const result = await saveScrapedLeads(leads);

    res.json({
      success: true,
      message: "Scraping completed",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
