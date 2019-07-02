import path from "path";
import fs from "fs";

import { nette } from "../marionette";
import { ParsingError } from "../parser";

const readExample = (example: string) => fs.readFileSync(path.join(__dirname, "..", "..", "examples", example), { encoding: "utf-8" });

test("Simple example", async () => {
    const browser = await nette.launch();
    await browser.run(readExample("simple.nette"));
    expect(browser).toBeDefined();
});

test("Evaluate example", async () => {
    const browser = await nette.launch();
    await browser.run(readExample("evaluate.nette"));
    expect(browser).toBeDefined();
});

test("Subroutine example", async () => {
    const browser = await nette.launch();
    await browser.run(readExample("subroutine.nette"));
    expect(browser).toBeDefined();
});

test("Unexpected first token error", async () => {
    const browser = await nette.launch();
    await expect(browser.run("error GOTO https://www.google.com")).rejects.toThrow(ParsingError);
});