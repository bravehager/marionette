import { Command, Operation } from "./command";
import Routine from "./routine";

/**
 * Parse a .nette file into a runnable Routine object.
 * @param contents
 * @param options 
 */
export default function parse({ contents, options }: { contents: string; options: object; }): Routine {
    let commands: Command[] = [];
    let lines: string[] = contents.split("\n");
    for (let line of lines) {
        if (line.trim() == "" || line.startsWith("#")) continue;
        let tokens: string[] | null = line.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
        if (tokens) {
            let command: Command = { type: tokens[0] as Operation, args: tokens.splice(1) };
            if (_validateCommandType(command)) commands.push(command);
        }
    }

    return new Routine(commands);
}

function _validateCommandType(command: Command): boolean {
    if (Operation[command.type] == null) throw new Error(`Invalid command type "${command.type}". Ignoring.`);
    else return true;
}