const speakArabicText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // تحديد اللغة العربية (يمكن تغيير اللهجة)
      utterance.rate = 1; // سرعة الكلام (يمكن تعديلها)
      utterance.pitch = 1; // نبرة الصوت (يمكن تعديلها)
  
      utterance.onerror = (event) => {
        console.error('حدث خطأ أثناء تحويل النص إلى كلام:', event);
      };
  
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('واجهة برمجة تطبيقات تحويل النص إلى كلام غير مدعومة في هذا المتصفح.');
    }
  };
  
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  
  export { speakArabicText, stopSpeaking };