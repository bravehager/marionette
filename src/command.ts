export enum Operation {
    NEW_PAGE = "NEW_PAGE",
    GOTO = "GOTO",
    DEF = "DEF",
    CLICK = "CLICK",
    TYPE = "TYPE",
    EXIT = "EXIT"
}

export interface Command {
    type: Operation;
    args: string[];
}