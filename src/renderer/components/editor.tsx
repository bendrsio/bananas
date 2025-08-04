import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { CursorPosition, EditorView } from "../../shared/types";

interface EditorProps {
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    cursorIndex: number
  ) => void;
  onSelectionChange?: (selectionStart: number, selectionEnd: number) => void;
}

const Editor = forwardRef<EditorView, EditorProps>(
  ({ onKeyDown, onSelectionChange }, ref) => {
    const [text, setText] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      render: (newText: string) => {
        setText(newText);
      },
      setCursorPosition: (position: CursorPosition) => {
        if (textareaRef.current) {
          const pos = position.char;
          textareaRef.current.setSelectionRange(pos, pos);
          textareaRef.current.focus();
        }
      },
    }));

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown && textareaRef.current) {
        onKeyDown(event, textareaRef.current.selectionStart);
      }
    };

    const handleSelect = () => {
      if (onSelectionChange && textareaRef.current) {
        onSelectionChange(
          textareaRef.current.selectionStart,
          textareaRef.current.selectionEnd
        );
      }
    };

    return (
      <textarea
        ref={textareaRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          padding: "20px",
          fontSize: "16px",
          fontFamily: "monospace",
          outline: "none",
          backgroundColor: "#282c34",
          color: "#abb2bf",
          resize: "none",
        }}
        value={text}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        placeholder="Start typing here..."
      />
    );
  }
);

export default Editor;
