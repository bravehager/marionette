/**
 * An operation is the building block of a Marionette routine. Each operation corresponds to a separate
 * function within the Puppeteer API.
 */
export enum Operation {
    NEW_PAGE = "NEW_PAGE",
    GOTO = "GOTO",
    DEF = "DEF",
    CLICK = "CLICK",
    TYPE = "TYPE",
    EXIT = "EXIT",
    EVALUATE = "EVALUATE",
    ROUTINE = "ROUTINE",
    END = "END",
    RUN = "RUN"
}

export enum Type {
    Command = "Command", String = "String"
}

export interface Token {
    type: string;
    value: string;
}

/**
 * Marionette uses a simple lexer in order to deconstruct .nette files.
 */
export class Lexer {

    /**
     * Convert a .nette file into an array of readable tokens.
     * @param input 
     */
    public static tokenize(input: string): Token[] {
        const filteredInput: string[] = this._filter(input);
        return filteredInput.map((value: string) => {
            let type: string;
            if (this._isOperation(value as Operation)) type = Type.Command;
            else type = Type.String;
            return { type, value };
        });
    }

    /**
     * Filter an input string into an array of strings which can be converted to tokens via
     * the `tokenize()` function.
     * @param input 
     */
    private static _filter(input: string): string[] {
        input = this._removeComments(input);
        const tokenized: string[] | null = input.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
        if (tokenized) return tokenized;
        else throw new Error("Input appears empty. Lexer returned null.")
    }

    private static _removeComments(input: string): string {
        let output: string = "";
        input.split("\n").forEach(line => {
            if (line.match(/^[^#].*/g)) output += line + "\n";
        });
        return output;
    }

    private static _isOperation(input: Operation): boolean {
        return !(Operation[input] == null);
    }
}