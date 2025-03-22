import React, { useState } from "react";
import { recognizeVoice } from "./services/voiceRecognition";
import { getQuestionIdFromGemini, checkAnswerFromGemini } from "./services/geminiService";
import { questions } from "./data/questions";
import QuestionImage from "./components/QuestionImage";
import RecordButton from "./components/RecordButton";
import "./App.css";

const App = () => {
  const [detectedQuestionId, setDetectedQuestionId] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [questionResult, setQuestionResult] = useState(null);

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const startRecordingQuestion = async () => {
    setRecording(true);
    try {
      const voiceText = await recognizeVoice();
      setLoading(true);
      const questionId = await getQuestionIdFromGemini(questions, voiceText);
      setDetectedQuestionId(questionId);
      const questionText = questions.filter( q => q.id == questionId )
      setQuestionResult(questionText[0].question)
      setLoading(false);
    } catch (error) {
      console.error("خطأ في التسجيل:", error);
      setLoading(false);
    }
    setRecording(false);
  };

  const startRecordingAnswer = async () => {
    setRecording(true);
    try {
      const answerText = await recognizeVoice();
      const question = questions.find((q) => q.id === detectedQuestionId);
      const isCorrect = await checkAnswerFromGemini(question, answerText);
      setUserAnswer(answerText);
      setAnswerResult(isCorrect);
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
          <QuestionImage key={q.id} src={q.src} alt={q.question} highlighted={detectedQuestionId === q.id} />
        ))}
      </div>
      <div className="button-container">
        <RecordButton onMouseDown={startRecordingQuestion} onMouseUp={() => setRecording(false)} text="🎙️ تسجيل السؤال" active={recording} />
        <RecordButton onMouseDown={startRecordingAnswer} onMouseUp={() => setRecording(false)} text="🎤 تسجيل الإجابة" active={recording} disabled={!detectedQuestionId} />
      </div>
      {loading ? <p className="status-text">جاري معالجة السؤال...</p> : <p className="status-text"> {questionResult} </p> }
     
      {userAnswer && <p>الإجابة: {userAnswer} - النتيجة: {answerResult}</p>}
    </div>
  );
};

export default App;
