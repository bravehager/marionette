import { Token, TokenValue, TokenType, CommandType } from "./token";
import { Buffer } from "./buffer";

const NEWLINE = /\n/g;
const COMMENT = />/g;
const SPACE = /[ \t]/g;

export interface LexerOptions {
  options?: object;
}

export class Lexer {
  public source: string;
  public options?: LexerOptions;
  private buffer: Buffer;

  private static startToken: Token = {
    type: TokenType.SOF,
    line: 0,
    column: 0
  };

  constructor(source: string, options?: LexerOptions) {
    this.source = source;
    this.options = options;
    this.buffer = new Buffer(source);
  }

  /** Read a token and advance the Lexer. */
  public advance(): Token {
    if (!this.buffer.hasNext())
      return { type: TokenType.EOF, line: -1, column: -1 };

    let char = this.buffer.next();
    while (char.match(SPACE)) {
      char = this.buffer.next();
    }

    let line: number = this.buffer.line;
    let column: number = this.buffer.column - 1;
    let value: TokenValue = "";

    if (char.match(NEWLINE)) {
      return { type: TokenType.NewLine, line, column };
    } else if (char.match(COMMENT)) {
      while (this.buffer.hasNext() && !char.match(NEWLINE)) {
        value += char;
        char = this.buffer.next();
      }
      return { value, type: TokenType.Comment, line, column };
    } else {
      while (
        this.buffer.hasNext() &&
        !char.match(NEWLINE) &&
        !char.match(SPACE)
      ) {
        value += char;
        char = this.buffer.next();
      }

      let type;
      if (CommandType[value as CommandType]) type = TokenType.Command;
      else type = TokenType.String;

      return { value, type, line, column };
    }
  }

  /* Convert a source file into an array of tokens */
  public tokenize(): Token[] {
    let tokens = [Lexer.startToken];
    do {
      tokens.push(this.advance());
    } while (tokens[tokens.length - 1].type != TokenType.EOF);
    return tokens;
  }
}
