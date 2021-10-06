import { Browser, Page, PuppeteerNode } from "puppeteer";
import { PuppeteerRequest } from '../interfaces/puppeteer-request';

const puppeteer: PuppeteerNode = require('puppeteer');

export class WebScraper {
	/**
	 *
	 * @param PuppeteerRequest
	 * @returns JSON Value of the inquired element.
	 */
	public scrapeProduct = (async (request: PuppeteerRequest) => {
		const browser: Browser = await puppeteer.launch();
		const page: Page = await browser.newPage();
		await page.goto(request.url);

		const [el] = await page?.$x(request.xpath);
		const src = await el.getProperty(request.prop);
		const srcText: string | undefined = await src?.jsonValue();

		browser.close();
		return srcText;
	});
}
