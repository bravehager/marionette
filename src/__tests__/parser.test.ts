import path from "path";
import fs from "fs";
import { Parser } from "../parser";
import puppeteer, { Browser } from "puppeteer";
import { Lexer } from "../lexer";

const simple = fs.readFileSync(path.join(__dirname, "..", "..", "examples", "simple.nette"), { encoding: "utf-8" });

test('simple', async () => {
    let parser = new Parser();
    let routine = parser.parse(Lexer.tokenize(simple));
    expect(routine).toBeDefined();
});