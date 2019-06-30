import { Command, Operation } from "./command";
import { Routine } from "./routine";

/**
 * A Parser is responsible for converting .nette style files into runnable Routine objects.
 */
export class Parser {
    constructor() { }
    
    /**
     * Parse a .nette file into a runnable Routine
     */
    parse({ contents }: { contents: string }): Routine {
        let commands: Command[] = [];
        let lines: string[] = contents.split("\n");
        
        for (let line of lines) {
            if (line.trim() == "" || line.startsWith("#")) continue;
            let tokens: string[] | null = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
            if (tokens) {
                let command: Command = new Command(tokens[0] as Operation, tokens.splice(1));
                if (this._validateCommandType(command)) commands.push(command);
            }
        }

        return new Routine(commands);
    }

    /**
     * Validate command type input based on Operation enum.
     */
    private _validateCommandType(command: Command): boolean {
        if (Operation[command.type] == null) throw new Error(`Invalid command type "${command.type}". Ignoring.`);
        else return true;
    }
}