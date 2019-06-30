import fs from "fs";
import path from "path";

import { Page, Browser } from "puppeteer";
import puppeteer from "puppeteer";
import { AssertionError } from "assert";

enum Operation {
    NEW_PAGE = "NEW_PAGE",
    GOTO = "GOTO",
    DEF = "DEF",
    CLICK = "CLICK",
    TYPE = "TYPE",
    EXIT = "EXIT"
}

interface Command {
    type: Operation;
    args: string[];
}

/**
 * Parse a .nette file into a runnable Program object.
 * @param contents
 * @param options 
 */
function parse(contents: string, options: object): Program {
    let commands: Command[] = [];
    let lines: string[] = contents.split("\n");
    for (let line of lines) {
        if (line.trim() == "" || line.startsWith("#")) continue;
        let tokens: string[] | null = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
        if (tokens) {
            let command: Command = { type: tokens[0] as Operation, args: tokens.splice(1) };
            if (_validateCommandType(command)) commands.push(command);
        }
    }

    return new Program(commands);
}

function _validateCommandType(command: Command): boolean {
    if (Operation[command.type] == null) throw new Error(`Invalid command type "${command.type}". Ignoring.`);
    else return true;
}

class Program {
    commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    /**
     * Main function for executing a marionette program.
     * @param browser 
     */
    async run(browser: Browser): Promise<Browser> {
        let pages: Page[] = await browser.pages();
        let page: Page = pages[0];
        
        let definitions: Map<string, string> = new Map();

        for (let command of this.commands) {
            let { NEW_PAGE, GOTO, DEF, CLICK, TYPE, EXIT } = Operation;
            let { type, args } = command;

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
        }

        return browser;
    }

}

const test: string = fs.readFileSync(path.join(__dirname, "..", "examples", "simple.nette"), { encoding: "utf-8" });
async function main(): Promise<void> {
    const program = parse(test, {});
    await program.run(await puppeteer.launch({
        headless: false
    }));
}

main();