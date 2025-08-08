import { LinesModel } from "../LinesModel";
import { ModelEventType } from "../../../shared/types";

describe("LinesModel", () => {
  test("initial state", () => {
    const m = new LinesModel("");
    expect(m.getAll()).toBe("");
    expect(m.getCursor()).toEqual({ line: 0, char: 0 });
    expect(m.isDirty()).toBe(false);
    expect(m.getFileInfo()).toBeNull();
  });

  test("insertChar and deleteChar update content, cursor, and dirty", () => {
    const m = new LinesModel("");
    m.insertChar("a");
    expect(m.getAll()).toBe("a");
    expect(m.getCursor()).toEqual({ line: 0, char: 1 });
    expect(m.isDirty()).toBe(true);

    m.deleteChar();
    expect(m.getAll()).toBe("");
    expect(m.getCursor()).toEqual({ line: 0, char: 0 });
  });

  test("enter splits line and moves cursor to next line", () => {
    const m = new LinesModel("abc");
    m.setDirty(false);
    m.setCursor({ line: 0, char: 3 });
    m.insertChar("\n");
    expect(m.getAll()).toBe("abc\n");
    expect(m.getCursor()).toEqual({ line: 1, char: 0 });
    expect(m.isDirty()).toBe(true);
  });

  test("move up/down preserves lastChar after typing", () => {
    const m = new LinesModel("hello\nworld");
    m.setCursor({ line: 0, char: 5 });
    m.insertChar("!"); // lastChar should be 6
    expect(m.getCursor()).toEqual({ line: 0, char: 6 });
    m.moveCursorDown();
    expect(m.getCursor()).toEqual({ line: 1, char: 6 - 1 }); // clamps to line length (5)
  });

  test("events: content changed and cursor moved fire", () => {
    const m = new LinesModel("");
    const contentSpy = jest.fn();
    const cursorSpy = jest.fn();
    m.on(ModelEventType.CONTENT_CHANGED, contentSpy);
    m.on(ModelEventType.CURSOR_MOVED, cursorSpy);
    m.insertChar("x");
    expect(contentSpy).toHaveBeenCalled();
    expect(cursorSpy).toHaveBeenCalled();
  });

  test("file info and dirty change events fire", () => {
    const m = new LinesModel("");
    const fileSpy = jest.fn();
    const dirtySpy = jest.fn();
    m.on(ModelEventType.FILE_INFO_CHANGED, fileSpy);
    m.on(ModelEventType.DIRTY_CHANGED, dirtySpy);
    m.setFileInfo({ filePath: "/tmp/a.md", fileName: "a.md" });
    expect(fileSpy).toHaveBeenCalledWith({
      filePath: "/tmp/a.md",
      fileName: "a.md",
    });
    m.setDirty(true);
    expect(dirtySpy).toHaveBeenCalledWith(true);
  });

  test("deleteChar deletes the last character of the line", () => {
    const m = new LinesModel("abc");
    m.setCursor({ line: 0, char: 3 });
    m.deleteChar();
    expect(m.getAll()).toBe("ab");
    expect(m.getCursor()).toEqual({ line: 0, char: 2 });
  });

  test("model is dirty after changes", () => {
    const m = new LinesModel("");
    m.setDirty(false);
    m.insertChar("x");
    expect(m.isDirty()).toBe(true);
  });

  test("model is not dirty after changes that don't affect content", () => {
    const m = new LinesModel("");
    m.setDirty(false);
    m.setCursor({ line: 0, char: 0 });
    m.moveCursorDown();
    expect(m.isDirty()).toBe(false);
  });
});
