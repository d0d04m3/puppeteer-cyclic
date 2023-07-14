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
express()
  .use((req, res, next) => 
    req.query.token === undefined ? res.sendStatus(401) : next()
  )
  .get("/status", asyncHandler(async (req, res) => {
   // console.log(sessions);
    if (sessions[req.query.token] == undefined) {
      res.sendStatus(404);
    } else res.sendStatus(200);
    
  }))
  .get("/start", asyncHandler(async (req, res) => {
    //console.log(sessions);
    if (sessions[req.query.token] == undefined) {
          sessions[req.query.token] = await startPuppeteerSession();
      res.sendStatus(200);

    } else res.sendStatus(302);
    
    
  }))
  .get("/navigate", asyncHandler(async (req, res) => {
    
    const page = await sessions[req.query.token].page ;
    await page.goto(req.query.to || "https://6i0e28-1880.csb.app/ping");
    res.sendStatus(200);
  }))
  .get("/content", asyncHandler(async (req, res) => {
    const page = await sessions[req.query.token].page;
   // console.log(sessions);
    res.send(await page.content()); 
  }))
  .get("/kill", asyncHandler(async (req, res) => {
    const browser = await sessions[req.query.token].browser;
    await browser.close();
    delete sessions[req.query.token];
   // console.log(sessions);
    res.sendStatus(200);
  }))
  .use((err, req, res, next) => res.sendStatus(500))
  .listen(3000, () => console.log("listening on port 3000"));
