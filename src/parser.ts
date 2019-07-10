import { Lexer } from "./lexer";
import { CommandType, TokenType, Token } from "./token";

/** Commands are the building blocks of a Marionette routine. */
export class Command {
  type: CommandType;
  args: (string | number)[];

  constructor(type: CommandType) {
    this.type = type;
    this.args = [];
  }

  push(argument: string | number) {
    this.args.push(argument);
  }
}

export function parse(source: string): Command[] {
  const lexer: Lexer = new Lexer(source);
  const commands: Command[] = [];
  const tokens: Token[] = lexer.tokenize();
  tokens.forEach(token => {
    try {
      if (token.type == TokenType.Command)
        commands.push(new Command(token.value as CommandType));
      else if (
        token.type == TokenType.String ||
        token.type == TokenType.BlockString
      )
        commands[commands.length - 1].push(token.value as string);
      else if (token.type == TokenType.Int)
        commands[commands.length - 1].push(parseInt(token.value as string));
    } catch (e) {
      const { value, type, line, column } = token;
      throw new ParsingError(
        `Parsing error at token ${type} ${value} - ${line}:${column}`
      );
    }
  });

  return commands;
}

export class ParsingError extends Error {}
