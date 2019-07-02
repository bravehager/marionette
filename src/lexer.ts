export enum TokenType {
  Command,
  String,
  NewLine,
  Comment
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
}

export class Lexer {
  /**
   * Convert a .nette file into an array of parsable tokens.
   * @param source
   */
  static tokenize(source: string): Token[] {
    let tokens: Token[] = [];
    while (source.length > 0) {
      source = this._pushNextToken(source, tokens);
    }
    return tokens;
  }

  /**
   * Remove the next token from the source string and push it into the token array,
   * responsible for classifying each token as a Command/NewLine/etc..
   * @param source
   * @param tokens
   */
  private static _pushNextToken(source: string, tokens: Token[]): string {
    let char: string = source.charAt(0);
    if (char == " ") return source.substring(1);

    let type: TokenType;
    let value: CommandType | string | number = "";

    if (char.match(/>/g)) {
      type = TokenType.Comment;
      while (!source.charAt(0).match(/(\r\n|\r|\n)/g)) {
        value += source.charAt(0);
        source = source.substring(1);
      }
      tokens.push({ type, value });
      return source;
    } else if (char.match(/(\r\n|\r|\n)/g)) {
      type = TokenType.NewLine;
      tokens.push({ type });
      return source.substring(1);
    } else {
      while (!(source.charAt(0).match(/[ \n]/g) || source.length == 0)) {
        value += source.charAt(0);
        source = source.substring(1);
      }
      if (this._isCommand(value)) type = TokenType.Command;
      else type = TokenType.String;

      tokens.push({ type, value });
      return source;
    }
  }

  private static _isCommand(value: string) {
    return CommandType[value as CommandType] != null;
  }
}
