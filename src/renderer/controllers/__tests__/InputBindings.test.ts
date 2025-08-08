import { resolveCommand, isTextInsertion } from "../InputBindings";

describe("InputBindings", () => {
  test("modifier shortcuts map to commands", () => {
    expect(resolveCommand({ key: "o", metaKey: true })).toBe("OPEN");
    expect(resolveCommand({ key: "s", metaKey: true })).toBe("SAVE");
    expect(resolveCommand({ key: "s", metaKey: true, shiftKey: true })).toBe(
      "SAVE_AS"
    );
    expect(resolveCommand({ key: "n", metaKey: true })).toBe("NEW");
  });

  test("arrows and editing keys map to commands", () => {
    expect(resolveCommand({ key: "ArrowLeft" })).toBe("MOVE_LEFT");
    expect(resolveCommand({ key: "ArrowRight" })).toBe("MOVE_RIGHT");
    expect(resolveCommand({ key: "ArrowUp" })).toBe("MOVE_UP");
    expect(resolveCommand({ key: "ArrowDown" })).toBe("MOVE_DOWN");
    expect(resolveCommand({ key: "Backspace" })).toBe("BACKSPACE");
    expect(resolveCommand({ key: "Enter" })).toBe("ENTER");
  });

  test("text insertion detection", () => {
    expect(isTextInsertion({ key: "a" })).toBe(true);
    expect(isTextInsertion({ key: "A", shiftKey: true })).toBe(true);
    expect(isTextInsertion({ key: "a", metaKey: true })).toBe(false);
    expect(isTextInsertion({ key: "a", ctrlKey: true })).toBe(false);
    expect(isTextInsertion({ key: "Enter" })).toBe(false);
  });
});
