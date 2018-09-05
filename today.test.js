import puppeteer from 'puppeteer';
import { getPort } from './utils/get-port';
import lighthouse from 'lighthouse';
import { sendMetrics } from './utils/sendmetrics';
require('dotenv').config()

describe('Running performance tests using lighthouse', () => {
    jest.setTimeout(80000);
    let page;
    let browser;
    let results;
    beforeAll(async() => {
        const URL = 'https://www.bbc.co.uk/';
        const databaseUrl = 'http://localhost:8086';

        browser = await puppeteer.launch({ slowMo: 0, headless: false });
        page = await browser.newPage();
        await page.goto(URL);
        await page.close();
        const browserWSEndpoint = browser.wsEndpoint();

        const thePort = await getPort(browserWSEndpoint);
        const { lhr } = await lighthouse(URL, { port: thePort, disableStorageReset: true }, null);
        results = lhr;
        const metricsData = `eemetrics,tag=ee first-contentful-paint=${results.audits['first-contentful-paint'].rawValue},first-meaningful-paint=${results.audits['first-meaningful-paint'].rawValue},speed-index=${results.audits['speed-index'].rawValue},time-to-first-byte=${results.audits['time-to-first-byte'].rawValue},time-to-interactive=${results.audits.interactive.rawValue},performance-score=${results.categories.performance.score},accessibility-score=${results.categories.accessibility.score}`;
        console.log(metricsData);
        await sendMetrics(databaseUrl, 'pwmetrics', metricsData);
    });

    afterAll(async () => {
        await page.close();
        await browser.close();
    });
    test('should generate results', async () => {
        expect(results).not.toBe(null);
    });
});
