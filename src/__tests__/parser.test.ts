import path from "path";
import fs from "fs";
import marionette from "../index";
import puppeteer, { Browser } from "puppeteer";

const simple = fs.readFileSync(path.join(__dirname, "..", "..", "examples", "simple.nette"), { encoding: "utf-8" });

test('simple', async () => {
    let { browser, page } = await marionette().run({ browser: await puppeteer.launch(), contents: simple, options: {} });
    expect(page.url()).toBe('https://www.google.com/');
    await browser.close();
});