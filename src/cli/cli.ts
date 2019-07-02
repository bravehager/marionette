#!/usr/bin/env node
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

import { Routine } from "../routine";
import { Parser } from "../parser";
import { Command } from "commander";
import { Lexer } from "../lexer";

const program: Command = new Command();
program.version("0.0.1");

program.command("run <file>").action(async (file, cmd) => {
  try {
    const contents: string = fs.readFileSync(path.join(".", file), {
      encoding: "utf-8"
    });
    const routine: Routine = Parser.parse(Lexer.tokenize(contents));
    await routine.run(await puppeteer.launch({ headless: false }));
  } catch (error) {
    console.log(error);
    console.log(`No such file ${path.join(".", file)}`);
    process.exit();
  }
});

program.parse(process.argv);
