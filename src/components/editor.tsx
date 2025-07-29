import React, { useState } from "react";

const Editor: React.FC = () => {
  const [text, setText] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <textarea
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        padding: "20px",
        fontSize: "16px",
        fontFamily: "monospace",
        outline: "none",
        // backgroundColor: "#282c34",
        // color: "#abb2bf",
      }}
      value={text}
      onChange={handleChange}
      placeholder="Start typing here..."
    />
  );
};

export default Editor;
