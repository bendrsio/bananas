import { ITextModel, EditorView, CursorPosition } from "../../shared/types";

export class EditorController {
  private model: ITextModel;
  private view: EditorView;

  constructor(model: ITextModel, view: EditorView) {
    this.model = model;
    this.view = view;

    this.view.render(this.model.getAll() || "");
  }

  public handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    // TODO: handle this properly lmao
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.model.insertChar(event.key);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      this.model.deleteChar();
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.model.insertChar("\n");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.model.moveCursorLeft();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.model.moveCursorRight();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.model.moveCursorUp();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.model.moveCursorDown();
    } else if (event.key === "o" && event.metaKey) {
      event.preventDefault();
      this.handleOpenFile();
    }
  };

  public handleOpenFile = async () => {
    const result = await window.electronAPI.openFile();
    if (result) {
      this.model.setContent(result);
    }
  };

  public handleCursorSelect = (position: CursorPosition) => {
    this.model.click(position.line, position.char);
  };
}
