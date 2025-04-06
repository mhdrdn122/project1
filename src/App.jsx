import React, {  useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // استيراد ملف CSS الخاص بالمكتبة
import { ToastContainer } from 'react-toastify'; // لاستضافة الـ Toasts
import { recognizeVoice } from "./services/voiceRecognition";
import { getQuestionIdFromGemini, checkAnswerFromGemini } from "./services/geminiService";
import { questions } from "./data/questions";
import QuestionImage from "./components/QuestionImage";
import RecordButton from "./components/RecordButton";
import { speakArabicText } from "./services/speechUtils";
import facts from '../public/assets/Sound/facts.mp3'
import erorr from '../public/assets/Sound/erorr.mp3'

import {  showSuccessConfetti, showFailureConfetti } from "./services/confettiUtils";


import "./App.css";
import ReactCanvasConfetti from "react-canvas-confetti";



const App = () => {
  const [detectedQuestionId, setDetectedQuestionId] = useState(null);
  const [disable, setDisable] = useState(" ");
  const [userAnswer, setUserAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [questionResult, setQuestionResult] = useState({id:0 , src:"" , question : "" , answer : ""});

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);


  const successSound = useRef(null);
  const failureSound = useRef(null);

  

  const startRecordingQuestion = async () => {
    setRecording(true);
    try {
      setLoading(true);
      const voiceText = await recognizeVoice();
      const questionId = await getQuestionIdFromGemini(questions, voiceText);
      setDetectedQuestionId(questionId);
      const questionText = questions.filter( q => q.id == questionId )
      setDisable(questionText[0].answer)
      console.log(questionText[0])

      setQuestionResult(questionText[0])

      setLoading(false);
     speakArabicText(questionText[0].question)

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
    speakArabicText(answerText);

    setAnswerResult(isCorrect);
    console.log(isCorrect);

    if (isCorrect === "صحيحة") {
      toast.success('إجابة صحيحة! 🎉');
      if (successSound.current) {
        successSound.current.currentTime = 0;
        successSound.current.play();
      }
      showSuccessConfetti(); 
    } else {
      toast.error('إجابة خاطئة! 😞');
      if (failureSound.current) {
        failureSound.current.currentTime = 0;
        failureSound.current.play();
      }
      showFailureConfetti(); 
    }
    
    
  } catch (error) {
    console.error("خطأ في التسجيل:", error);

  }
  setRecording(false);
};
  return (
    <>
      <div className={`app-container ${recording ? "recording" : ""}`}>
      <h1>نظام التعرف على الأسئلة</h1>
      <div className="image-gallery">


<QuestionImage key={questionResult.id } src={questionResult.src.length > 10 ? questionResult.src : "" } alt={questionResult.question} highlighted={detectedQuestionId === questionResult.id} />

      </div>
      <div className="button-container">
        <RecordButton onMouseDown={startRecordingQuestion} onMouseUp={() => setRecording(false)} text="🎙️ تسجيل السؤال" active={recording} />
        <RecordButton onMouseDown={startRecordingAnswer} onMouseUp={() => setRecording(false)} text="🎤 تسجيل الإجابة" active={recording} disabled={disable} />
      </div>
      {loading ? <p className="status-text">جاري معالجة السؤال...</p> : <p className="status-text"> {questionResult.question} </p> }

      {userAnswer && <p>الإجابة: {userAnswer} - النتيجة: {answerResult ? 'صحيحة' : 'خاطئة'}</p>}

    </div>

    <audio ref={successSound} src={facts} preload="auto" />
      <audio ref={failureSound} src={erorr} preload="auto" />


   
<ToastContainer />
    </>

  );
};



export default App;