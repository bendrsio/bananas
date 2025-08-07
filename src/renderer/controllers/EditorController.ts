import { ITextModel, EditorView, CursorPosition } from "../../shared/types";

export class EditorController {
  private model: ITextModel;
  private view: EditorView;

  constructor(model: ITextModel, view: EditorView) {
    this.model = model;
    this.view = view;
  }

  // Removed direct DOM responsibility; title is managed by a view-layer component

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
    } else if (event.key === "s" && event.metaKey) {
      event.preventDefault();
      this.handleSaveFile();
    } else if (event.key === "S" && event.metaKey && event.shiftKey) {
      event.preventDefault();
      this.handleSaveAs();
    } else if (event.key === "n" && event.metaKey) {
      event.preventDefault();
      this.handleNewFile();
    }
  };

  public handleOpenFile = async () => {
    const result = await window.electronAPI.openFile();
    if (result) {
      this.model.setContent(result.content);
      this.model.setFileInfo({
        filePath: result.filePath,
        fileName: result.fileName,
      });
      this.model.setDirty(false);
    }
  };

  public handleSaveFile = async (): Promise<boolean> => {
    const content = this.model.getAll();
    if (!content) return false;

    const fileInfo = this.model.getFileInfo();
    if (fileInfo?.filePath) {
      await window.electronAPI.writeFile(fileInfo.filePath, content);
      this.model.setDirty(false);
      return true;
    }
    const saved = await window.electronAPI.saveFile(content);
    if (saved) {
      const { filePath, fileName } = saved;
      this.model.setFileInfo({ filePath, fileName });
      this.model.setDirty(false);
      return true;
    }
    return false;
  };

  public handleSaveAs = async () => {
    const content = this.model.getAll();
    if (!content) return;
    const saved = await window.electronAPI.saveFile(content);
    if (saved) {
      const { filePath, fileName } = saved;
      this.model.setFileInfo({ filePath, fileName });
      this.model.setDirty(false);
    }
  };

  public handleNewFile = async () => {
    if (!this.model.isDirty()) {
      this.model.setContent("");
      this.model.setFileInfo(null);
      return;
    }
    const response = await window.electronAPI.confirmSaveBeforeNew();
    if (response === 2) {
      return; // Cancel
    }
    if (response === 0) {
      const saved = await this.handleSaveFile();
      if (!saved) {
        return;
      }
    }
    this.model.setContent("");
    this.model.setFileInfo(null);
  };

  public handleCursorSelect = (position: CursorPosition) => {
    this.model.click(position.line, position.char);
  };
}
