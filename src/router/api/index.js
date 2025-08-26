const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

/**
 * @swagger
 * /api/scrap:
 *   post:
 *     tags:
 *       - Scraper
 *     summary: Scrape webpage content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL to scrape
 *               delay:
 *                 type: integer
 *                 description: Wait time in milliseconds
 *                 default: 30000
 *               content_tag:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: HTML tags to extract
 *                 default: ['html', 'body', 'div', 'h1']
 *     responses:
 *       200:
 *         description: Successfully scraped content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullHtml:
 *                   type: string
 *                 taggedContent:
 *                   type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/scrap", async (req, res) => {
  let browser = null;
  try {
    const decodedUrl = req.body.url;
    const timeout = req.body.timeout || 30000;
    const content_tag = req.body.content_tag || [
      "html",
      "body",
      "head",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "li",
      "ul",
      "ol",
      "a",
      "img",
      "table",
    ];

    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-crash-reporter",
        "--no-first-run",
        "--single-process",
        "--disable-crashpad",
        "--no-crash-upload",
        "--disable-breakpad",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(timeout);
    await page.goto(decodedUrl, { waitUntil: "networkidle0" });

    const content = await page.evaluate((tags) => {
      const results = {};

      tags.forEach((tag) => {
        const elements = document.getElementsByTagName(tag);
        results[tag] = Array.from(elements).map((el) => ({
          text: el.innerText,
          // html: el.innerHTML,
          // attributes: Array.from(el.attributes).reduce((attrs, attr) => {
          //     attrs[attr.name] = attr.value;
          //     return attrs;
          // }, {})
        }));
      });

      return results;
    }, content_tag);

    res.json({
      data: content,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

module.exports = router;
