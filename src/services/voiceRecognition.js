// Function to recognize voice input and return the detected text
export const recognizeVoice = () => {
  return new Promise((resolve, reject) => {
    // Initialize the Speech Recognition API
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    // Handle the result when voice recognition succeeds
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      if (voiceText.trim()) {
        resolve(voiceText); // Return the detected text
      } else {
        reject("الصوت غير واضح");
      }
    };

    // Stop recognition when the mouse is released
    const stopRecognition = () => {
      recognition.stop();
    };

    document.addEventListener("mouseup", stopRecognition, { once: true });

    // Handle any recognition errors
    recognition.onerror = (event) => {
      reject(`خطأ في التعرف على الصوت: ${event.error}`);
    };

    // Start voice recognition
    recognition.start();
  });
};
