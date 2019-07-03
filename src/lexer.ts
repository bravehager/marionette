const NEWLINE = RegExp(/(\r\n|\r|\n)/g);
const NEWLINE_OR_SPACE = RegExp(/[ \n]/g);
const COMMENT = RegExp(/>/g);

export enum TokenType {
  Command,
  String,
  NewLine,
  Comment,
  Null
}

export enum CommandType {
  ROUTINE = "ROUTINE",
  RUN = "RUN",
  GOTO = "GOTO",
  EXIT = "EXIT",
  END = "END",
  EVALUATE = "EVALUATE",
  DEF = "DEF"
}

export interface Token {
  type: TokenType;
  value?: CommandType | string;
  position: Position;
}

export interface Position {
  line: number;
  column: number;
}

export class Lexer {
  /**
   * Convert a .nette file into an array of parsable tokens.
   * @param source
   */
  static tokenize(source: string): Token[] {
    let tokens: Token[] = [];
    let position = { line: 1, column: 1 };

    while (source.length > 0) {
      source = this._pushNextToken(source, tokens, position);
    }
    return tokens;
  }

  /**
   * Remove the next token from the source string and push it into the token array,
   * responsible for classifying each token as a Command/NewLine/etc..
   * @param source
   * @param tokens
   */
  private static _pushNextToken(
    source: string,
    tokens: Token[],
    position: Position
  ): string {
    let tokenPosition: Position = JSON.parse(JSON.stringify(position));
    let char: string = source.charAt(0);
    if (char == " ") {
      position.column++;
      return source.substring(1);
    }

    let type: TokenType;
    let value: CommandType | string | number = "";

    if (char.match(COMMENT)) {
      type = TokenType.Comment;
      while (!source.charAt(0).match(NEWLINE)) {
        value += source.charAt(0);
        source = source.substring(1);
        position.column++;
      }
      tokens.push({ type, value, position: tokenPosition });
      return source;
    } else if (char.match(NEWLINE)) {
      type = TokenType.NewLine;
      tokens.push({ type, position: tokenPosition });
      position.line++;
      position.column = 1;
      return source.substring(1);
    } else {
      while (
        !(source.charAt(0).match(NEWLINE_OR_SPACE) || source.length == 0)
      ) {
        value += source.charAt(0);
        source = source.substring(1);
        position.column++;
      }

      type = this._isCommand(value) ? TokenType.Command : TokenType.String;
      tokens.push({ type, value, position: tokenPosition });
      return source;
    }
  }

  private static _isCommand(value: string) {
    return CommandType[value as CommandType] != null;
  }
}
