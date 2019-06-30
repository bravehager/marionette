import { Command, Operation } from "./command";
import * as Puppeteer from "puppeteer";

/**
 * A routine returns an object consisting of a Puppeteer Browser and Page.
 */
export interface RoutineResponse {
    browser: Puppeteer.Browser;
    page: Puppeteer.Page;
}

/**
 * A Routine is a sequence of Puppeteer commands.
 */
export class Routine {
    /**
     * An array of commands which defines the routine.
     */
    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    /**
     * Main function for executing a marionette routine.
     * @param browser
     */
    async run(browser: Puppeteer.Browser): Promise<RoutineResponse> {
        let pages: Puppeteer.Page[] = await browser.pages();
        let page: Puppeteer.Page = pages[0];

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