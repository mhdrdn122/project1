import React from "react";

// Component to render the question image with optional highlighting
const QuestionImage = ({ src, alt, highlighted }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`question-image ${highlighted ? "highlight" : ""}`}
    />
  );
};

export default QuestionImage;
