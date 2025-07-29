import { ITextModel } from "../../shared/types";

export class LinesModel implements ITextModel {
  private lines: string[] = [];

  insert(index: number, text: string): void {
    this.lines.splice(index, 0, text);
  }

  delete(index: number, count: number): void {
    this.lines.splice(index, count);
  }

  getChar(line: number, char: number): string | undefined {
    return this.lines[line]?.[char];
  }

  getAll(): string | undefined {
    return this.lines.join("\\n");
  }
}
