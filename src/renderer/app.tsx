import React, { useState, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Editor from "./components/editor";
import { EditorView, ModelEventType } from "../shared/types";
import { EditorController } from "./controllers/EditorController";
import { LinesModel } from "./models/LinesModel";

const App = () => {
  const [controller, setController] = useState<EditorController | null>(null);
  const [model] = useState(() => new LinesModel(""));

  const editorRef = useCallback(
    (editorView: EditorView | null) => {
      if (editorView && !controller) {
        const newController = new EditorController(model, editorView);
        setController(newController);
      }
    },
    [controller]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <WindowTitleManager model={model} />
      <CloseGuard controller={controller} model={model} />
      <Editor
        ref={editorRef}
        onKeyDown={controller?.handleKeyDown}
        onCursorSelect={controller?.handleCursorSelect}
        model={model}
      />
    </div>
  );
};

const CloseGuard: React.FC<{
  controller: EditorController | null;
  model: LinesModel;
}> = ({ controller, model }) => {
  useEffect(() => {
    if (!controller) return;
    const attempt = async () => {
      if (!model.isDirty()) {
        window.electronAPI.proceedClose();
        return;
      }
      const res = await window.electronAPI.confirmSaveBeforeNew();
      if (res === 2) {
        window.electronAPI.cancelClose();
        return;
      }
      if (res === 0) {
        const saved = await controller?.handleSaveFile();
        if (!saved) {
          window.electronAPI.cancelClose();
          return;
        }
      }
      window.electronAPI.proceedClose();
    };
    const off = window.electronAPI.onAttemptClose(attempt);
    return () => {
      off();
    };
  }, [controller, model]);
  return null;
};

const WindowTitleManager: React.FC<{ model: LinesModel }> = ({ model }) => {
  useEffect(() => {
    const update = () => {
      const info = model.getFileInfo();
      document.title = info?.fileName
        ? `${info.fileName} - Bananas`
        : "Bananas";
    };
    update();
    const onFileInfo = () => update();
    model.on(ModelEventType.FILE_INFO_CHANGED, onFileInfo);
    return () => {
      model.off(ModelEventType.FILE_INFO_CHANGED, onFileInfo);
    };
  }, [model]);
  return null;
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
