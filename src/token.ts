export type TokenValue = CommandType | string;

export interface Token {
  type: TokenType;
  value?: TokenValue;
  line: number;
  column: number;
}

export enum TokenType {
  SOF = "<SOF>",
  EOF = "<EOF>",
  Command = "Command",
  String = "String",
  BlockString = "BlockString",
  Comment = "Comment",
  NewLine = "NewLine"
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
