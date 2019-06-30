import parser from "./parser";
import Routine from "./routine";
import { Command } from "./command";
import { Browser, Page } from "puppeteer";

export default class Marionette {
    constructor() { }

    static async run({ browser, contents, options }: { browser: Browser; contents: string; options: object; }): Promise<{ browser: Browser, page: Page }> {
        const routine = parser({ contents, options });
        return await routine.run(browser);
    }

    static parse({ contents, options }: {contents: string, options: object }): Routine {
        return parser({ contents, options });
    }
}