import { ITextModel, EditorView, CursorPosition } from "../../shared/types";
import { resolveCommand, isTextInsertion } from "./InputBindings";

export class EditorController {
  private model: ITextModel;
  private view: EditorView;

  constructor(model: ITextModel, view: EditorView) {
    this.model = model;
    this.view = view;
  }

  public handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    const command = resolveCommand({
      key: event.key,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    });

    if (
      isTextInsertion({
        key: event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      })
    ) {
      event.preventDefault();
      this.model.insertChar(event.key);
      return;
    }

    switch (command) {
      case "BACKSPACE":
        event.preventDefault();
        this.model.deleteChar();
        break;
      case "ENTER":
        event.preventDefault();
        this.model.insertChar("\n");
        break;
      case "MOVE_LEFT":
        event.preventDefault();
        this.model.moveCursorLeft();
        break;
      case "MOVE_RIGHT":
        event.preventDefault();
        this.model.moveCursorRight();
        break;
      case "MOVE_UP":
        event.preventDefault();
        this.model.moveCursorUp();
        break;
      case "MOVE_DOWN":
        event.preventDefault();
        this.model.moveCursorDown();
        break;
      case "OPEN":
        event.preventDefault();
        this.handleOpenFile();
        break;
      case "SAVE":
        event.preventDefault();
        this.handleSaveFile();
        break;
      case "SAVE_AS":
        event.preventDefault();
        this.handleSaveAs();
        break;
      case "NEW":
        event.preventDefault();
        this.handleNewFile();
        break;
      default:
        break;
    }
  };

  public handleOpenFile = async () => {
    if (this.model.isDirty()) {
      const response = await window.electronAPI.confirmSaveBeforeNew();
      if (response === 2) {
        return;
      }
      if (response === 0) {
        const saved = await this.handleSaveFile();
        if (!saved) {
          return;
        }
      }
      // response === 1 (Don't Save) falls through to open
    }

    const result = await window.electronAPI.openFile();
    if (!result) return;
    this.model.setContent(result.content);
    this.model.setFileInfo({
      filePath: result.filePath,
      fileName: result.fileName,
    });
    this.model.setDirty(false);
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
