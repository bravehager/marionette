import { Command, Operation } from "./command";
import { Browser, Page } from "puppeteer";

export default class Routine {
    commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    /**
     * Main function for executing a marionette routine.
     * @param browser 
     */
    async run(browser: Browser): Promise<{ browser: Browser, page: Page }> {
        let pages: Page[] = await browser.pages();
        let page: Page = pages[0];

        let definitions: Map<string, string> = new Map();

        for (let command of this.commands) {
            let { NEW_PAGE, GOTO, DEF, CLICK, TYPE, EXIT } = Operation;
            let { type, args } = command;

            try {
                switch (type) {
                    case NEW_PAGE:
                        page = await browser.newPage();
                        break;
                    case GOTO:
                        let url = definitions.get(args[0]) || args[0];
                        await page.goto(url);
                        break;
                    case DEF:
                        definitions.set(args[0], args[1]);
                        break;
                    case CLICK:
                        await page.click(args[0]);
                        break;
                    case TYPE:
                        await page.type(args[0], args[1]);
                        break;
                    case EXIT:
                        await browser.close();
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log(`Error encountered at ${type} ${args}. ${error.message}`);
                return { browser, page };
            }
        }

        return { browser, page };
    }

}