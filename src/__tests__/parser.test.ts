import path from "path";
import fs from "fs";

import { Parser, ParsingError } from "../parser";
import { Lexer } from "../lexer";

const readExample = (example: string) =>
  fs.readFileSync(path.join(__dirname, "..", "..", "examples", example), {
    encoding: "utf-8"
  });

test("Simple example", async () => {
  let routine = Parser.parse(Lexer.tokenize(readExample("simple.nette")));
  expect(routine).toBeDefined();
});

test("Evaluate example", async () => {
  let routine = Parser.parse(Lexer.tokenize(readExample("evaluate.nette")));
  expect(routine).toBeDefined();
});

test("Subroutine example", async () => {
  let routine = Parser.parse(Lexer.tokenize(readExample("subroutine.nette")));
  expect(routine).toBeDefined();
});

test("Unexpected first token error", async () => {
  let routine = () =>
    Parser.parse(Lexer.tokenize("error GOTO https://www.google.com"));
  expect(routine).toThrowError(ParsingError);
});
