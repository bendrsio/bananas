import { ITextModel } from "../types";

export class StringModel implements ITextModel {
  private text: string = "";

  insert(index: number, text: string): void {
    this.text = this.text.slice(0, index) + text + this.text.slice(index);
  }

  delete(index: number, count: number): void {
    this.text = this.text.slice(0, index) + this.text.slice(index + count);
  }

  getChar(index: number): string | undefined {
    return this.text[index];
  }

  getAll(): string | undefined {
    return this.text;
  }
}
