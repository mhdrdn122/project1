export const recognizeVoice = () => {
    return new Promise((resolve, reject) => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const voiceText = event.results[0][0].transcript;
            if (voiceText.trim()) {
                resolve(voiceText);
            } else {
                reject('الصوت غير واضح');
            }
        };

        recognition.onerror = (event) => {
            reject(`خطأ في التعرف على الصوت: ${event.error}`);
        };

        const stopRecognition = () => {
            recognition.stop();
        };

        document.addEventListener('mouseup', stopRecognition, { once: true });

        recognition.start();
    });
};
