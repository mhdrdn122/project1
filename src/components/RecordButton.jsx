import React from "react";

// Component to render a recording button
const RecordButton = ({ onMouseDown, onMouseUp, text, active, disabled }) => {


  return (
    <button
      onMouseDown={onMouseDown} 
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      className={`record-btn ${active ? "active" : ""}`}
      disabled={text === "🎙️ تسجيل السؤال" ? false : disabled === " " ? true : false}
    >
      {text}
    </button>
  );
};

export default RecordButton;
