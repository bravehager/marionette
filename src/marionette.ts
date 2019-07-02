import * as Puppeteer from "puppeteer";
import puppeteer from "puppeteer";

import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Routine } from "./routine";

/**
 * Main class for executing Marionette routines.
 */
export class Marionette {
  private browser: Puppeteer.Browser | undefined;

  constructor() {
    this.browser = undefined;
  }

  /**
   * Initializes a Chromium instance via Puppeteer. Must be called before `Marionette.run()`.
   * @param options
   */
  async launch(options?: Puppeteer.BrowserOptions) {
    this.browser = await puppeteer.launch(options);
    return this;
  }

  /**
   * Runs a routine.
   * @param input
   */
  async run(input: string | Routine) {
    let routine: Routine;
    if (input instanceof Routine) {
      routine = input;
    } else routine = Parser.parse(Lexer.tokenize(input));
    if (this.browser) {
      await routine.run(this.browser);
    } else
      throw new Error("Cannot execute, Puppeteer instance is not defined.");
  }
}

export const nette = new Marionette();
