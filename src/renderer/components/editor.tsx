import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import {
  CursorPosition,
  EditorView,
  ITextModel,
  ModelEventType,
} from "../../shared/types";

interface EditorProps {
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCursorSelect?: (position: CursorPosition) => void;
  model: ITextModel;
}

const Editor = forwardRef<EditorView, EditorProps>(
  ({ onKeyDown, onCursorSelect, model }, ref) => {
    const [text, setText] = useState<string>("");
    const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
      line: 0,
      char: 0,
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initial focus on mount
    useEffect(() => {
      textareaRef.current?.focus();
    }, []);

    useEffect(() => {
      const handleContentChange = () => {
        const newText = model.getAll();
        setText(newText);
      };

      const handleCursorChange = (newPos: CursorPosition) => {
        setCursorPosition(newPos);
      };

      model.on(ModelEventType.CONTENT_CHANGED, handleContentChange);
      model.on(ModelEventType.CURSOR_MOVED, handleCursorChange);

      return () => {
        model.off(ModelEventType.CONTENT_CHANGED, handleContentChange);
        model.off(ModelEventType.CURSOR_MOVED, handleCursorChange);
      };
    }, [model]);

    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const currentTextValue = textarea.value;

        let pos = 0;
        const lines = currentTextValue.split("\n");

        for (let i = 0; i < cursorPosition.line && i < lines.length; i++) {
          pos += lines[i].length + 1;
        }
        pos += cursorPosition.char;

        pos = Math.min(pos, currentTextValue.length);

        textarea.setSelectionRange(pos, pos);
      }
    }, [cursorPosition, text]);

    useImperativeHandle(ref, () => ({
      render: (newText: string) => {
        setText(newText);
      },
      setCursorPosition: (newPos: CursorPosition) => {
        setCursorPosition(newPos);
      },
    }));

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
    };

    const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
      const textarea = event.currentTarget;
      const cursorPosition = textarea.selectionStart;

      let line = 0;
      let char = 0;
      const lines = textarea.value.split("\n");

      let charactersSum = 0;
      for (let i = 0; i < lines.length; i++) {
        if (charactersSum + lines[i].length + 1 > cursorPosition) {
          line = i;
          char = cursorPosition - charactersSum;
          break;
        }
        charactersSum += lines[i].length + 1;
      }

      onCursorSelect?.({ line, char });
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
        onClick={handleClick}
        placeholder="Start typing here..."
      />
    );
  }
);

export default Editor;
