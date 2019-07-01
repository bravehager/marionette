import { Operation } from "./lexer";

export class Command {
    type: Operation;
    args: string[];

    constructor(type: Operation) {
        this.type = type;
        this.args = [];
    }

    push(arg: string): void {
        this.args.push(arg);
    }
}