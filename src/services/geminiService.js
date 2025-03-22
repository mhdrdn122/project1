import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDx55LPyLCaKNrdfBwC-QmJCVpMQDvMu0Y");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getQuestionIdFromGemini = async (questions, voiceText) => {
  const prompt = `لدي مجموعة من الأسئلة التالية:\n${questions
    .map((q) => `${q.id}- ${q.question}`)
    .join("\n")}\nما هو رقم السؤال الذي يطابق النص التالي: "${voiceText}"؟`;

  try {
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    const questionId = parseInt(answer.match(/\d+/)?.[0], 10);
    return isNaN(questionId) ? null : questionId;
  } catch (error) {
    console.error("خطأ في استدعاء Gemini:", error);
    return null;
  }
};

export const checkAnswerFromGemini = async (question, answerText) => {
  const prompt = `السؤال: "${question.question}"\nالإجابة المقدمة: "${answerText}"\nالإجابة الصحيحة: "${question.answer}"\nهل الإجابة صحيحة أم خاطئة؟`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    const isCorrect = reply.includes("صحيحة") ? "صحيحة" : "خاطئة";
    return isCorrect;
  } catch (error) {
    console.error("خطأ في استدعاء Gemini للتحقق من الإجابة:", error);
    return "خطأ";
  }
};
