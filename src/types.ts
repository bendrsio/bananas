export interface ITextModel {
  insert(index: number, text: string): void;
  delete(index: number, count: number): void;
  getChar(line: number, char: number): string | undefined;
  getAll(): string | undefined;
}
