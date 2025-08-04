export interface ITextModel {
  insert(index: number, text: string): void;
  delete(index: number, count: number): void;
  getChar(line: number, char: number): string | undefined;
  getAll(): string | undefined;
}

export interface TextChange {
  type: "insert" | "delete";
  index: number;
  text?: string;
  length?: number;
}

export interface CursorPosition {
  line: number;
  char: number;
}

export interface SelectionRange {
  start: CursorPosition;
  end: CursorPosition;
}

export interface EditorView {
  render(text: string): void;
  setCursorPosition(position: CursorPosition): void;
}
