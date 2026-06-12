const { chromium } = require("playwright");
const Lead = require("../models/Lead.model");

const {
  sleep,
  cleanPhone,
  makeUniqueKey,
  getCategoryFromQuery,
  getCityFromQuery,
} = require("../utils/helper");

const SCROLL_TIMES = 8;
const SCROLL_WAIT = 1000;
const DETAIL_PAGE_WAIT = 1200;
const QUERY_WAIT = 3000;
const HEADLESS = true;

async function autoScroll(page) {
  const scrollContainer = page.locator('div[role="feed"]');

  for (let i = 0; i < SCROLL_TIMES; i++) {
    try {
      await scrollContainer.evaluate((el) => {
        el.scrollBy(0, 2500);
      });

      await sleep(SCROLL_WAIT);
    } catch {
      break;
    }
  }
}

async function getText(page, selector) {
  try {
    return (await page.locator(selector).first().textContent()) || "";
  } catch {
    return "";
  }
}

async function getAttribute(page, selector, attr) {
  try {
    return (await page.locator(selector).first().getAttribute(attr)) || "";
  } catch {
    return "";
  }
}

async function scrapeSingleQuery(query, maxLeads = 100) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    query,
  )}`;

  await page.goto(searchUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await sleep(QUERY_WAIT);
  await autoScroll(page);

  const cards = await page.locator('a[href*="/maps/place/"]').all();
  const links = [];

  for (const card of cards) {
    const href = await card.getAttribute("href").catch(() => "");

    if (href && href.includes("/maps/place/") && !links.includes(href)) {
      links.push(href);
    }

    if (links.length >= maxLeads) break;
  }

  const scrapedLeads = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    try {
      await page.goto(link, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      await sleep(DETAIL_PAGE_WAIT);

      const name = await getText(page, "h1");
      const address = await getText(page, 'button[data-item-id="address"]');

      const website = await getAttribute(
        page,
        'a[data-item-id="authority"]',
        "href",
      );

      let phone = await getText(page, 'button[data-item-id^="phone"]');
      phone = cleanPhone(phone);

      const rating = await getText(page, 'div.F7nice span[aria-hidden="true"]');
      const reviews = await getText(
        page,
        'button[jsaction*="pane.reviewChart"]',
      );

      if (!name) continue;

      const lead = {
        name: name.trim(),
        phone,
        category: getCategoryFromQuery(query),
        city: getCityFromQuery(query),
        address: address.trim(),
        website,
        mapLink: link,
        rating,
        reviews,
      };

      lead.uniqueKey = makeUniqueKey(lead);

      scrapedLeads.push(lead);

      console.log(`Lead ${i + 1}: ${lead.name} ${lead.phone}`);
    } catch (error) {
      console.log("Lead scrape failed:", error.message);
    }
  }

  await browser.close();

  return scrapedLeads;
}

async function saveScrapedLeads(leads) {
  let inserted = 0;
  let duplicate = 0;
  let failed = 0;

  for (const lead of leads) {
    try {
      await Lead.create(lead);
      inserted++;
    } catch (error) {
      if (error.code === 11000) {
        duplicate++;
      } else {
        failed++;
      }
    }
  }

  return {
    total: leads.length,
    inserted,
    duplicate,
    failed,
  };
}

module.exports = {
  scrapeSingleQuery,
  saveScrapedLeads,
};
