import React, { useRef, useEffect } from "react";

const QuestionMedia = ({ src, alt, highlighted }) => {
  const videoRef = useRef(null);
  let parts = src.split("/");
  console.log(parts);

  let lastElement = parts[parts.length - 1];
  let extension = lastElement ? lastElement.split(".")[1]?.toLowerCase() : "";

  useEffect(() => {
    if (extension === "mp4" && videoRef.current) {
      videoRef.current.play();
    }
  }, [extension]); 

  

  return (
    <>
      {extension === "mp4" ? (
        <video
          ref={videoRef}
          src={src}
          alt={alt}
          className={`question-media ${highlighted ? "highlight" : ""}`}
          controls={false} 
          autoPlay 
          loop={false} 
        />
      ) : (
        
        <img
          src={src}
          alt={alt}
          className={`question-media ${highlighted ? "highlight" : ""}`}
        />
      )}
    </>
  );
};

export default QuestionMedia;