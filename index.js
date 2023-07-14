const chromium = require('chrome-aws-lambda');
const express = require("express");
const app = express(); // Initializing Express
exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://google.com');

    result = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};
app.get("/demo", asyncHandler(async (req, res) => {
    res.sendStatus(200)
  }))
  app.use((err, req, res, next) => res.sendStatus(500))
 // Making Express listen on port 7000
    app.listen(3000, function () {
      console.log(`Running on port 3000.`);
    });
