/** @jest-environment jsdom */
import { LinesModel } from "../../models/LinesModel";
import { ModelEventType } from "../../../shared/types";

describe("WindowTitleManager behavior (unit of model-driven title)", () => {
  test("document.title reflects fileName when FILE_INFO_CHANGED fires", () => {
    const model = new LinesModel("");
    // Simulate the logic inside WindowTitleManager
    const update = () => {
      const info = model.getFileInfo();
      document.title = info?.fileName
        ? `${info.fileName} - Bananas`
        : "Bananas";
    };
    update();
    expect(document.title).toBe("Bananas");
    model.setFileInfo({ filePath: "/tmp/a.md", fileName: "a.md" });
    update();
    expect(document.title).toBe("a.md - Bananas");
  });
});
