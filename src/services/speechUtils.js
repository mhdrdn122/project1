const speakArabicText = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech is not supported in this browser.');
      return reject('TTS not supported');
    }

    // Cancel any ongoing speech before starting
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Use custom options if provided, otherwise use defaults
    utterance.lang = options.lang || 'ar-SA'; // Default to Arabic (Saudi)
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Try to select an Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      resolve('Speech finished');
    };

    utterance.onerror = (event) => {
      console.error('An error occurred during speech synthesis:', event);
      reject(event.error);
    };

    window.speechSynthesis.speak(utterance);
  });
};

const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export { speakArabicText, stopSpeaking };
