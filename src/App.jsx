import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import  { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyDx55LPyLCaKNrdfBwC-QmJCVpMQDvMu0Y');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const GeminiChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async (voiceText) => {
        if (!voiceText.trim()) return;

        setMessages((prev) => [
            ...prev,
            { text: voiceText, sender: 'user', time: getCurrentTime() },
        ]);

        try {
            const result = await model.generateContent(voiceText);
            const answer = result.response.text();
            setMessages((prev) => [
                ...prev,
                { text: answer, sender: 'gemini', time: getCurrentTime() },
            ]);
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };

    const deleteMessage = (index) => {
        setMessages((prev) => prev.filter((_, i) => i !== index));
    };

    const startRecording = () => {
        setRecording(true);

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const voiceText = event.results[0][0].transcript;
            if (voiceText.trim()) {
                handleSend(voiceText);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setRecording(false);
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Error starting recognition:', err);
        }

        const stopRecording = () => {
            recognition.stop();
            setRecording(false);
        };

        document.addEventListener('mouseup', stopRecording, { once: true });
    };

    return (
        <div className="chat-container">
            <h1 className="title">محادثة مع Gemini</h1>
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? 'الوضع الغامق' : 'الوضع الفاتح'}
            </button>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <span className="message-time">{msg.time}</span>
                        <p>{msg.text}</p>
                        <button className="delete-button" onClick={() => deleteMessage(index)}>🗑️</button>
                    </div>
                ))}
            </div>
            <div className="input-box">
                <button
                    onMouseDown={startRecording}
                    className={`record-button ${recording ? 'recording' : ''}`}
                >
                    🎙️ تسجيل
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GeminiChatApp;
