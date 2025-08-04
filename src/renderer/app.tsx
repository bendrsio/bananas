import React, { useRef, useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import Editor from "./components/editor";
import { EditorView } from "../shared/types";
import { StringModel } from "./models/StringModel";
import { EditorController } from "./controllers/EditorController";

const App = () => {
  const [controller, setController] = useState<EditorController | null>(null);

  const editorRef = useCallback(
    (editorView: EditorView | null) => {
      if (editorView && !controller) {
        const model = new StringModel("");
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
      <Editor
        ref={editorRef}
        onKeyDown={controller?.handleKeyDown}
        onSelectionChange={controller?.handleCursorChange}
      />
    </div>
  );
};

const root = createRoot(document.body);
root.render(<App />);
