const express = require("express");
const agentRoutes = require("./agent.routes");
const leadRoutes = require("./lead.routes");
const scraperRoutes = require("./scraper.routes");

const router = express.Router();

const defaultRoute = [
  {
    path: "/agents",
    route: agentRoutes,
  },
  {
    path: "/leads",
    route: leadRoutes,
  },
  {
    path: "/scraper",
    route: scraperRoutes,
  },
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
