#!/usr/bin/env node
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { Command } from "commander";

import { Lexer } from "../lexer";
import { parse } from "../parser";
import { Marionette } from "../marionette";

const program: Command = new Command();
program.version("0.0.1");

program.command("run <file>").action(async (file: string, cmd: object) => {
  try {
    const contents: string = fs.readFileSync(path.join(".", file), {
      encoding: "utf-8"
    });
    const nette = new Marionette();
    await nette.launch({ headless: false });
    await nette.run(contents);
  } catch (error) {
    console.log(error);
    console.log(`No such file ${path.join(".", file)}`);
    process.exit();
  }
});

program.command("lex <file>").action(async (file: string, cmd: object) => {
  try {
    const contents: string = fs.readFileSync(path.join(".", file), {
      encoding: "utf-8"
    });
    const lexer = new Lexer(contents);
    console.log(lexer.tokenize());
  } catch (error) {
    console.log(error);
    console.log(`No such file ${path.join(".", file)}`);
    process.exit();
  }
});

program.command("parse <file>").action(async (file: string, cmd: object) => {
  try {
    const contents: string = fs.readFileSync(path.join(".", file), {
      encoding: "utf-8"
    });
    console.log(parse(contents));
  } catch (error) {
    console.log(error);
    console.log(`No such file ${path.join(".", file)}`);
    process.exit();
  }
});

program.parse(process.argv);
