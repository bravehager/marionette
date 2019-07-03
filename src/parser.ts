import { TokenType, Token, CommandType } from "./lexer";
import { Routine } from "./routine";

/** Commands are the building blocks of a Marionette routine. */
export class Command {
  type: CommandType;
  args: string[];

  constructor(type: CommandType) {
    this.type = type;
    this.args = [];
  }

  push(argument: string) {
    this.args.push(argument);
  }
}

/** A generic error for handling unexpected tokens during parsing. */
export class ParsingError extends Error {}

/** The parser is responsible for converting an array of tokens into a runnable Marionette routine. */
export class Parser {
  static parse(tokens: Token[]): Routine {
    let commands: Command[] = [];
    tokens.forEach(token => {
      try {
        if (token.type == TokenType.Command)
          commands.push(new Command(token.value as CommandType));
        else if (token.type == TokenType.String)
          commands[commands.length - 1].push(token.value as string);
      } catch (e) {
        const { value, type, position } = token;
        const { line, column } = position;
        throw new ParsingError(
          `Parsing error at token ${type} ${value} - ${line}:${column}`
        );
      }
    });

    return new Routine(commands);
  }
}
