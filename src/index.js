const express = require("express");
const app = express();
const ukTranslation = require("../i18n/uk.po.json");
// it's build of TTag lib with new feature when you can add function as arg for useLocale method
const { t, useLocale, addLocale } = require("../dist/ttag");
// const { t, useLocale, addLocale } = require("ttag");

const { AsyncLocalStorage } = require("node:async_hooks");

const asyncLocalStorage = new AsyncLocalStorage();
addLocale("uk", ukTranslation);

app.get("/", function (req, res) {
  const locale = req.query.lang || "en";

  asyncLocalStorage.enterWith(locale);
  useLocale(() => asyncLocalStorage.getStore());
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });

  let count = 7;
  res.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AsyncStorage Demo</title>
  </head>
  <body>
  `);

  function streamNextChunk() {
    if (count !== 0) {
      res.write(`<p>${t`test message`}</p>`);
      count--;
      setTimeout(streamNextChunk, 1000);
    } else {
      res.write(`
        </body>
        </html>
        `);
      res.end();
    }
  }

  streamNextChunk();
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
