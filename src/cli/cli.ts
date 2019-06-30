#!/usr/bin/env node
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

import { Routine } from "../routine";
import { Parser } from "../parser";
import { Command } from "commander";


const program: Command = new Command();
program.version("0.0.1");

program
    .command("run <file>")
    .action(async (file, cmd) => {
        const parser: Parser = new Parser();
        const contents: string = fs.readFileSync(path.join(".", file), { encoding: "utf-8" });
        const routine: Routine = parser.parse({ contents });
        await routine.run(await puppeteer.launch({ headless: false }));
    });

program.parse(process.argv);