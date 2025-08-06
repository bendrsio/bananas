import { ITextModel, EditorView, CursorPosition } from "../../shared/types";

export class EditorController {
  private model: ITextModel;
  private view: EditorView;

  constructor(model: ITextModel, view: EditorView) {
    this.model = model;
    this.view = view;

    this.view.render(this.model.getAll() || "");
    this.view.setCursorPosition({ line: 0, char: 0 });
  }

  public handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    cursorIndex: number
  ): void => {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.model.insert(cursorIndex, event.key);
      this.view.render(this.model.getAll() || "");
      this.view.setCursorPosition({ line: 0, char: cursorIndex + 1 });
    } else if (event.key === "Backspace") {
      event.preventDefault();
      if (cursorIndex > 0) {
        this.model.delete(cursorIndex - 1, 1);
        this.view.render(this.model.getAll() || "");
        this.view.setCursorPosition({ line: 0, char: cursorIndex - 1 });
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.model.insert(cursorIndex, "\n");
      this.view.render(this.model.getAll() || "");
      this.view.setCursorPosition({ line: 0, char: cursorIndex + 1 });
    }
  };

  public handleCursorChange = (
    selectionStart: number,
    selectionEnd: number
  ): void => {
    console.log("Selection changed:", selectionStart, selectionEnd);
  };
}
