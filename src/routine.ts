import fs from "fs";
import path from "path";
import * as Puppeteer from "puppeteer";

import { Command, parse } from "./parser";
import { CommandType } from "./token";

/** A Routine is a sequence of Puppeteer commands. */
export class Routine {
  /** An array of commands which defines the routine. */
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  /**
   * Execute a Marionette routine.
   * @param browser
   */
  async run(browser: Puppeteer.Browser): Promise<void> {
    let pages: Puppeteer.Page[] = await browser.pages();
    let page: Puppeteer.Page = pages[0];

    let commands = JSON.parse(JSON.stringify(this.commands)); // pass by value
    let variableMap: Map<string, string> = new Map();
    let routineMap: Map<string, Command[]> = new Map();

    await this._execute(commands, variableMap, routineMap, browser, page);
  }

  /** Recursively execute each discrete step in a Marionette routine */
  private async _execute(
    commands: Command[],
    variableMap: Map<string, string>,
    routineMap: Map<string, Command[]>,
    browser: Puppeteer.Browser,
    page: Puppeteer.Page
  ): Promise<void> {
    let command: Command = commands[0];
    command.args = command.args.map(
      arg => variableMap.get(arg as string) || arg
    );

    switch (command.type) {
      case CommandType.ROUTINE:
        routineMap.set(
          command.args[0] as string,
          this._getSubRoutine(commands)
        );
        break;

      case CommandType.RUN:
        let routine: Command[] | undefined = routineMap.get(command
          .args[0] as string);
        if (routine)
          await this._execute(routine, variableMap, routineMap, browser, page);
        commands.shift();
        break;

      case CommandType.DEF:
        variableMap.set(command.args[0] as string, command.args[1] as string);
        commands.shift();
        break;

      case CommandType.GOTO:
        await page.goto(command.args[0] as string);
        commands.shift();
        break;

      case CommandType.EVALUATE:
        let filePath: string = path.join(".", command.args[0] as string);
        let script: string = fs.readFileSync(filePath, { encoding: "utf-8" });
        await page.evaluate(script);
        commands.shift();
        break;

      case CommandType.EXIT:
        await browser.close();
        return;

      default:
        commands.shift();
        break;
    }

    if (commands[0])
      return await this._execute(
        commands,
        variableMap,
        routineMap,
        browser,
        page
      );
    else return;
  }

  private _getSubRoutine(commands: Command[]): Command[] {
    let routine: Command[] = [];
    let command: Command | undefined = commands.shift() as Command;
    let stack: Command[] = [command];

    while (stack.length > 0) {
      command = commands.shift();
      if (command && command.type == CommandType.ROUTINE) stack.push(command);
      else if (command && command.type == CommandType.END) stack.pop();
      else if (command) routine.push(command);
      else throw new Error(`Error evaluating subroutine at ${stack.pop()}`);
    }

    routine.pop();
    return routine;
  }
}
