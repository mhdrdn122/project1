import React, { useState } from "react";
import { recognizeVoice } from "./voiceRecognition";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";
import damas from "./assets/images/damas.jfif";
import maka from "./assets/images/maka.jfif";

const genAI = new GoogleGenerativeAI("AIzaSyDx55LPyLCaKNrdfBwC-QmJCVpMQDvMu0Y");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const questions = [
  { id: 1, question: "أين تقع دمشق؟", answer: "سوريا", src: damas },
  { id: 2, question: "أين تقع مكة؟", answer: "السعودية", src: maka },
];

const GeminiVoiceQuestionDetection = () => {
  const [detectedQuestionId, setDetectedQuestionId] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);

  const handleSendToGemini = async (voiceText) => {
    setLoading(true);
    const prompt = `لدي مجموعة من الأسئلة التالية:\n${questions
      .map((q) => `${q.id}- ${q.question}`)
      .join("\n")}\nما هو رقم السؤال الذي يطابق النص التالي: "${voiceText}"؟`;
    try {
      const result = await model.generateContent(prompt);
      const answer = result.response.text();
      const questionId = parseInt(answer.match(/\d+/)?.[0], 10);

      if (!isNaN(questionId)) {
        setDetectedQuestionId(questionId);
        console.log("رقم السؤال المكتشف:", questionId); 
      } else {
        setDetectedQuestionId(null);
      }
    } catch (error) {
      console.error("خطأ في استدعاء Gemini:", error);
    }
    setLoading(false);
  };

  const handleSendAnswerToGemini = async (answerText) => {
    setAnswerLoading(true);
    const selectedQuestion = questions.find((q) => q.id === detectedQuestionId);
    const prompt = `السؤال: "${selectedQuestion?.question}"\nالإجابة المقدمة: "${answerText}"\nالإجابة الصحيحة: "${selectedQuestion?.answer}"\nهل الإجابة صحيحة أم خاطئة؟`;
    try {
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      const isCorrect = reply.includes("صحيحة") ? "صحيحة" : "خاطئة";
      setUserAnswer(answerText);
      setAnswerResult(isCorrect);
    } catch (error) {
      console.error("خطأ في استدعاء Gemini للتحقق من الإجابة:", error);
    }
    setAnswerLoading(false);
  };

  
  const startRecordingQuestion = async () => {
    setRecording(true);
    try {
      const voiceText = await recognizeVoice();
      await handleSendToGemini(voiceText);
    } catch (error) {
      console.error("خطأ في التسجيل:", error);
    }
    setRecording(false);
  };

  
  const startRecordingAnswer = async () => {
    setRecording(true);
    try {
      const answerText = await recognizeVoice();
      await handleSendAnswerToGemini(answerText);
    } catch (error) {
      console.error("خطأ في التسجيل:", error);
    }
    setRecording(false);
  };

  return (
    <div className={`app-container ${recording ? "recording" : ""}`}>
      <h1>نظام التعرف على الأسئلة</h1>
      <div className="image-gallery">
        {questions.map((q) => (
          <img
            key={q.id}
            src={q.src}
            alt={q.question}
            className={`question-image ${
              detectedQuestionId === q.id ? "highlight" : ""
            }`}
          />
        ))}
      </div>
      <div className="button-container">
        <button
          onMouseDown={startRecordingQuestion}
          onMouseUp={() => setRecording(false)}
          className={`record-btn ${recording ? "active" : ""}`}
        >
          🎙️ تسجيل السؤال
        </button>
        <button
          onMouseDown={startRecordingAnswer}
          onMouseUp={() => setRecording(false)}
          className={`record-btn ${recording ? "active" : ""}`}
          disabled={!detectedQuestionId}
        >
          🎤 تسجيل الإجابة
        </button>
      </div>
      {loading && <p className="status-text">جاري معالجة السؤال...</p>}
      {answerLoading && <p className="status-text">جاري معالجة الإجابة...</p>}
      {detectedQuestionId && <p> السؤال : {detectedQuestionId}</p>}
      {userAnswer && (
        <p>
          الإجابة : "{userAnswer}" - النتيجة: {answerResult}
        </p>
      )}
    </div>
  );
};

export default GeminiVoiceQuestionDetection;
