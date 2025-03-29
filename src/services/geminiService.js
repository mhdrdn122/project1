import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDx55LPyLCaKNrdfBwC-QmJCVpMQDvMu0Y");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Sends a list of predefined questions along with the user's spoken text to Gemini.
 * Gemini should return only the number of the matching question.
 */
export const getQuestionIdFromGemini = async (questions, voiceText) => {
  const prompt = `لدي قائمة من الأسئلة مرقمة من 1 إلى ${questions.length} كما يلي:\n\n` +
    questions.map(q => `${q.id}- ${q.question}`).join("\n") +
    `\n\nالمستخدم قال الجملة التالية بصوته: \n"${voiceText}"\n\n` +
    `استنادًا إلى القائمة أعلاه، حدد فقط رقم السؤال الذي يطابق ما قاله المستخدم بدون إضافة أي نص آخر.`;

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

/**
 * Sends the detected question number along with the user's answer
 * to check if the answer is correct.
 */
export const checkAnswerFromGemini = async (question, answerText) => {
  const prompt = `لدينا السؤال التالي:\n"${question.question}"\n\n` +
    `الإجابة الصحيحة هي: "${question.answer}"\n\n` +
    `المستخدم قال الإجابة التالية: "${answerText}"\n\n` +
    `استنادًا إلى الإجابة الصحيحة، هل إجابة المستخدم صحيحة أم خاطئة؟\n` +
    `رجاءً أجب فقط بكلمة واحدة: "صحيحة" أو "خاطئة".`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();
    const isCorrect = reply.includes("صحيحة") ? "صحيحة" : "خاطئة";
    return isCorrect;
  } catch (error) {
    console.error("خطأ في استدعاء Gemini للتحقق من الإجابة:", error);
    return "خطأ";
  }
};
