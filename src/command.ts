export enum Operation {
    NEW_PAGE = "NEW_PAGE",
    GOTO = "GOTO",
    DEF = "DEF",
    CLICK = "CLICK",
    TYPE = "TYPE",
    EXIT = "EXIT"
}

export class Command {
    type: Operation;
    args: string[];

    constructor(type: Operation, args: string[]) {
        this.type = type;
        this.args = args;
    }
}