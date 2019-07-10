import path from "path";
import fs from "fs";

import { Lexer } from "../lexer";

const readExample = (example: string) =>
  fs.readFileSync(path.join(__dirname, "..", "..", "examples", example), {
    encoding: "utf-8"
  });

test("Simple example", async () => {
  const lexer = new Lexer(readExample("simple.nette"));
  expect(lexer.tokenize()).toBeDefined();
});

test("Evaluate example", async () => {
  const lexer = new Lexer(readExample("evaluate.nette"));
  expect(lexer.tokenize()).toBeDefined();
});

test("Subroutine example", async () => {
  const lexer = new Lexer(readExample("subroutine.nette"));
  expect(lexer.tokenize()).toBeDefined();
});
