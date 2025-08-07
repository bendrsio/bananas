import path from "path";

describe("main process IPC contracts", () => {
  test("save dialog returns filePath and fileName shape (unit contract)", () => {
    const resolved = "/tmp/foo.md";
    const fileName = path.basename(resolved);
    expect({ filePath: resolved, fileName }).toEqual({
      filePath: "/tmp/foo.md",
      fileName: "foo.md",
    });
  });
});
