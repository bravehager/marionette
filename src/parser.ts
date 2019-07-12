import { Lexer } from "./lexer";
import { CommandType, TokenType, Token, TokenValue } from "./token";

/** Commands are the building blocks of a Marionette routine. */
export class Command {
  type: CommandType;
  args: TokenValue[];

  constructor(type: CommandType) {
    this.type = type;
    this.args = [];
  }

  push(argument: TokenValue) {
    this.args.push(argument);
  }
}

export function parse(source: string): Command[] {
  const lexer: Lexer = new Lexer(source);
  const commands: Command[] = [];
  const tokens: Token[] = lexer.tokenize();
  tokens.forEach(({ type, value, line, column }: Token) => {
    try {
      if (type == TokenType.Command)
        commands.push(new Command(value as CommandType));
      else if (type == TokenType.String || type == TokenType.BlockString)
        commands[commands.length - 1].push(value as string);
    } catch (e) {
      throw new ParsingError(
        `Parsing error at token ${type} ${value} - ${line}:${column}`
      );
    }
  });

  return commands;
}

export class ParsingError extends Error {}
