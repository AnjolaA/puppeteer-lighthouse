const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const auth = require('./utils/adfs-login');
const metrics = require('./utils/sendmetrics');
const fs = require('fs');

puppeteer.launch({headless: false}).then(async browser => {
    const URL='https://stage-lifeatsky.herokuapp.com';
    const username = 'data01@3dflyingmonsters.co.uk';
    const password = 'Password1';
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0"});
  await auth.login(page, username, password);
  await page.close();

  const browserWSEndpoint = browser.wsEndpoint();
  browser.disconnect();

  // Use the endpoint to reestablish a connection
  const browser2 = await puppeteer.connect({browserWSEndpoint});

  let thePort= await getPort(browserWSEndpoint);
  await runLighthouse(URL, thePort);

async function runLighthouse(URL, thePort ) {
    const flags = {onlyCategories: ['performance']};
    return lighthouse(URL, { port: thePort, disableStorageReset: true, onlyCategories: ['performance']  }, null).then(results => {
        // Use results!
        const data = JSON.parse(results.report);
        let the_score = data.categories.performance.score;
        console.log(`The score is ${the_score}`);
        const metrics_data = `eemetrics,tag=ee first-contentful-paint=${data.audits['first-contentful-paint'].rawValue},first-meaningful-paint=${data.audits['first-meaningful-paint'].rawValue},speed-index=${data.audits['speed-index'].rawValue},time-to-first-byte=${data.audits['time-to-first-byte'].rawValue},time-to-interactive=${data.audits['interactive'].rawValue},performance-score=${data.categories.performance.score}`; 
         console.log(metrics_data);
        metrics.sendMetrics('http://localhost:8086','pwmetrics', metrics_data);
        fs.writeFile("output.json", results.report, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
      });
  }

  async function getPort(string) {
    var regx = /127.0.0.1:(.*)\/dev/;
    var portArray = regx.exec(string);
    return portArray[1];
  };
  await browser2.close();
});