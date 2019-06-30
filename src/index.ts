import parser from "./parser";
import Program from "./program";
import { Command } from "./command";
import { Browser, Page } from "puppeteer";

class Marionette {
    constructor() { }

    async run({ browser, contents, options }: { browser: Browser; contents: string; options: object; }): Promise<{ browser: Browser, page: Page }> {
        const program = parser({ contents, options });
        return await program.run(browser);
    }

    parse({ contents, options }: {contents: string, options: object }): Program {
        return parser({ contents, options });
    }
}

export default function marionette() {
    return new Marionette;
}