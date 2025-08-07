import { EditorController } from "../EditorController";
import { LinesModel } from "../../models/LinesModel";
import { EditorView } from "../../../shared/types";

type ElectronAPIMock = {
  openFile: jest.Mock;
  saveFile: jest.Mock;
  writeFile: jest.Mock;
  confirmSaveBeforeNew: jest.Mock;
  onAttemptClose: jest.Mock;
  proceedClose: jest.Mock;
  cancelClose: jest.Mock;
};

describe("EditorController", () => {
  let model: LinesModel;
  let view: EditorView;
  let electronAPI: ElectronAPIMock;

  beforeEach(() => {
    model = new LinesModel("");
    view = {
      render: () => {},
      setCursorPosition: () => {},
    };
    electronAPI = {
      openFile: jest.fn(),
      saveFile: jest.fn(),
      writeFile: jest.fn(),
      confirmSaveBeforeNew: jest.fn(),
      onAttemptClose: jest.fn().mockReturnValue(() => {}),
      proceedClose: jest.fn(),
      cancelClose: jest.fn(),
    };
    (global as any).window = { electronAPI };
  });

  test("open file when not dirty loads content and clears dirty", async () => {
    const controller = new EditorController(model, view);
    electronAPI.openFile.mockResolvedValue({
      content: "hello",
      filePath: "/tmp/a.md",
      fileName: "a.md",
    });
    await controller.handleOpenFile();
    expect(model.getAll()).toBe("hello");
    expect(model.getFileInfo()).toEqual({
      filePath: "/tmp/a.md",
      fileName: "a.md",
    });
    expect(model.isDirty()).toBe(false);
    expect(electronAPI.confirmSaveBeforeNew).not.toHaveBeenCalled();
  });

  test("open file aborts on cancel when dirty", async () => {
    const controller = new EditorController(model, view);
    model.setDirty(true);
    electronAPI.confirmSaveBeforeNew.mockResolvedValue(2);
    await controller.handleOpenFile();
    expect(electronAPI.openFile).not.toHaveBeenCalled();
  });

  test("open file proceeds after successful save when dirty and Save chosen", async () => {
    const controller = new EditorController(model, view);
    model.setContent("unsaved");
    model.setDirty(true);
    electronAPI.confirmSaveBeforeNew.mockResolvedValue(0);
    electronAPI.saveFile.mockResolvedValue({
      filePath: "/tmp/b.md",
      fileName: "b.md",
    });
    electronAPI.openFile.mockResolvedValue({
      content: "next",
      filePath: "/tmp/c.md",
      fileName: "c.md",
    });
    await controller.handleOpenFile();
    expect(electronAPI.saveFile).toHaveBeenCalled();
    expect(model.getAll()).toBe("next");
    expect(model.getFileInfo()).toEqual({
      filePath: "/tmp/c.md",
      fileName: "c.md",
    });
    expect(model.isDirty()).toBe(false);
  });

  test("open file proceeds without saving when Don't Save chosen", async () => {
    const controller = new EditorController(model, view);
    model.setDirty(true);
    electronAPI.confirmSaveBeforeNew.mockResolvedValue(1);
    electronAPI.openFile.mockResolvedValue({
      content: "next",
      filePath: "/tmp/c.md",
      fileName: "c.md",
    });
    await controller.handleOpenFile();
    expect(electronAPI.saveFile).not.toHaveBeenCalled();
    expect(model.getAll()).toBe("next");
  });

  test("save file with existing path writes and clears dirty", async () => {
    const controller = new EditorController(model, view);
    model.setContent("text");
    model.setDirty(true);
    model.setFileInfo({ filePath: "/tmp/x.md", fileName: "x.md" });
    electronAPI.writeFile.mockResolvedValue("/tmp/x.md");
    const result = await controller.handleSaveFile();
    expect(result).toBe(true);
    expect(electronAPI.writeFile).toHaveBeenCalledWith("/tmp/x.md", "text");
    expect(model.isDirty()).toBe(false);
  });

  test("save file without path uses save dialog and updates fileInfo", async () => {
    const controller = new EditorController(model, view);
    model.setContent("text");
    model.setDirty(true);
    electronAPI.saveFile.mockResolvedValue({
      filePath: "/tmp/new.md",
      fileName: "new.md",
    });
    const result = await controller.handleSaveFile();
    expect(result).toBe(true);
    expect(model.getFileInfo()).toEqual({
      filePath: "/tmp/new.md",
      fileName: "new.md",
    });
    expect(model.isDirty()).toBe(false);
  });

  test("save as updates fileInfo and clears dirty when user picks a path", async () => {
    const controller = new EditorController(model, view);
    model.setContent("text");
    model.setDirty(true);
    electronAPI.saveFile.mockResolvedValue({
      filePath: "/tmp/sa.md",
      fileName: "sa.md",
    });
    await controller.handleSaveAs();
    expect(model.getFileInfo()).toEqual({
      filePath: "/tmp/sa.md",
      fileName: "sa.md",
    });
    expect(model.isDirty()).toBe(false);
  });

  test("new when not dirty clears content and fileInfo", async () => {
    const controller = new EditorController(model, view);
    model.setContent("abc");
    model.setDirty(false);
    await controller.handleNewFile();
    expect(model.getAll()).toBe("");
    expect(model.getFileInfo()).toBeNull();
  });

  test("new when dirty and cancel does nothing", async () => {
    const controller = new EditorController(model, view);
    model.setContent("abc");
    model.setDirty(true);
    electronAPI.confirmSaveBeforeNew.mockResolvedValue(2);
    await controller.handleNewFile();
    expect(model.getAll()).toBe("abc");
  });

  test("new when dirty and Save requires successful save then clears", async () => {
    const controller = new EditorController(model, view);
    model.setContent("abc");
    model.setDirty(true);
    electronAPI.confirmSaveBeforeNew.mockResolvedValue(0);
    electronAPI.saveFile.mockResolvedValue({
      filePath: "/tmp/n.md",
      fileName: "n.md",
    });
    await controller.handleNewFile();
    expect(model.getAll()).toBe("");
    expect(model.getFileInfo()).toBeNull();
  });
});
