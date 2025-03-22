import React from "react";

// Component to render a recording button
const RecordButton = ({ onMouseDown, onMouseUp, text, active, disabled }) => {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={`record-btn ${active ? "active" : ""}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RecordButton;
