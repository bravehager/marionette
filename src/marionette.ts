import * as Puppeteer from "puppeteer";
import puppeteer from "puppeteer";

import { Lexer } from "./lexer";
import { parse } from "./parser";
import { Routine } from "./routine";

/** Main class for executing Marionette routines. */
export class Marionette {
  private browser?: Puppeteer.Browser;

  constructor() {}

  /**
   * Initializes a Chromium instance via Puppeteer. Must be called before `Marionette.run()`.
   * @param options
   */
  async launch(options?: Puppeteer.LaunchOptions | undefined) {
    this.browser = await puppeteer.launch(options);
    return this;
  }

  /**
   * Runs a routine.
   * @param source
   */
  async run(source: string | Routine) {
    let routine: Routine;
    if (source instanceof Routine) {
      routine = source;
    } else routine = new Routine(parse(source));
    if (this.browser) {
      await routine.run(this.browser);
    } else
      throw new Error("Cannot execute, Puppeteer instance is not defined.");
  }
}

export const nette = new Marionette();
