import { createRoot } from "react-dom/client";
import Editor from "./components/editor";

const root = createRoot(document.body);
root.render(
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Editor />
  </div>
);
