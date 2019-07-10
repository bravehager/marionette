/** Super simple buffer for reading characters from a string */
export class Buffer {
  public source: string = "";
  public position: number = 0;
  public line: number = 1;
  public column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  public hasNext(): boolean {
    return !(this.position > this.source.length);
  }

  /** Read one character from the current position of the buffer */
  public read(): string {
    let char: string = this.source.charAt(this.position);
    return char;
  }

  /** Read one character from the buffer and advance to the next position. */
  public next(): string {
    if (!this.hasNext()) throw new EOFError("Buffer does not have next");
    let char: string = this.read();
    if (char.match(/(\r\n|\r|\n)/g)) {
      this.line++;
      this.column = 1;
    } else this.column++;
    this.position++;
    return char;
  }
}

export class EOFError extends Error {}
