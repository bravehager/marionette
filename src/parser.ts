import { Command } from "./command";
import { Routine } from "./routine";
import * as Lexer from "./lexer";

/**
 * A Parser is responsible for converting .nette style files into runnable Routine objects.
 */
export class Parser {
    constructor() { }
    
    /**
     * Parse a tokenized .nette file into a runnable Routine.
     */
    parse(tokens: Lexer.Token[]): Routine {
        let commands: Command[] = [];
        for (const token of tokens) {
            if (token.type == Lexer.Type.Command) commands.push(new Command(token.value as Lexer.Operation));
            else commands[commands.length-1].push(token.value);
        }

        return new Routine(commands);
    }

    /**
     * Validate command type input based on Operation enum.
     */
    private _validateCommandType(command: Command): boolean {
        if (Lexer.Operation[command.type] == null) throw new Error(`Invalid command type "${command.type}". Ignoring.`);
        else return true;
    }
}