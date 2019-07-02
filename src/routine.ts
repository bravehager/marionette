import fs from "fs";
import path from "path";
import * as Puppeteer from "puppeteer";

import { Lexer, CommandType } from "./lexer";
import { Parser, Command } from "./parser";

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
     * Execute a Marionette routine.
     * @param browser 
     */
    async run(browser: Puppeteer.Browser): Promise<RoutineResponse> {
        let pages: Puppeteer.Page[] = await browser.pages();
        let page: Puppeteer.Page = pages[0];

        let commands = JSON.parse(JSON.stringify(this.commands)); // pass by value
        let variableMap: Map<string, string> = new Map();
        let routineMap: Map<string, Command[]> = new Map();

        await this._execute(commands, variableMap, routineMap, browser, page);
        return { page, browser };

    }

    /**
     * Recursively execute each discrete step in a Marionette routine
     * @param commands 
     * @param variableMap 
     * @param routineMap 
     * @param browser 
     * @param page 
     */
    private async _execute(commands: Command[], variableMap: Map<string, string>, routineMap: Map<string, Command[]>, browser: Puppeteer.Browser, page: Puppeteer.Page): Promise<boolean> {
        let command: Command = commands[0];
        command.args = command.args.map((arg) => variableMap.get(arg) || arg);
        switch (command.type) {
            case (CommandType.ROUTINE):
                let name = command.args[0];
                let subRoutine: Command[] = [];
                let routineStack: number[] = [1];
                command = commands.shift() as Command;
                while (routineStack.length != 0) {
                    command = commands.shift() as Command;
                    if (command.type == CommandType.ROUTINE) routineStack.push(1);
                    if (command.type == CommandType.END) routineStack.pop();
                    subRoutine.push(command);
                }
                subRoutine.pop(); // remove END command from subroutine
                routineMap.set(name, subRoutine);
                break;
            case (CommandType.RUN):
                console.log(routineMap);
                let routine: Command[] | undefined = routineMap.get(command.args[0]);
                if (routine) await this._execute(routine, variableMap, routineMap, browser, page);
                commands.shift();
                break;
            case (CommandType.DEF):
                variableMap.set(command.args[0], command.args[1]);
                commands.shift();
                break;
            case (CommandType.GOTO):
                await page.goto(command.args[0]);
                commands.shift();
                break;
            case (CommandType.EVALUATE):
                let script: string = fs.readFileSync(path.join(".", command.args[0]), { encoding: "utf-8" });
                await page.evaluate(script);
                commands.shift();
                break;
            default:
                commands.shift();
                break;
        }

        if (commands[0]) return await this._execute(commands, variableMap, routineMap, browser, page);
        else return true;
    }
}