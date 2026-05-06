// LUNAR Neural OS v8.0 (Auto-Neural Discovery)
const GEMINI_API_KEY = 'AIzaSyBX7QvS90QNFqtuFZsG3QVCC5L7s8ytM2Y';
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;
const synth = window.speechSynthesis;

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const statusText = document.getElementById('lunar-status');

let isListening = false;
let activeModelUrl = null;

// 1. Auto-Discovery Module
async function discoverNeuralLink() {
    statusText.textContent = "scanning neural links...";
    const endpoints = [
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
        'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
    ];

    for (let url of endpoints) {
        try {
            const res = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
            });
            if (res.ok) {
                activeModelUrl = url;
                console.log("LUNAR: Active Neural Link found at " + url);
                statusText.textContent = "online";
                return true;
            }
        } catch (e) { console.warn("Link failed: " + url); }
    }
    statusText.textContent = "offline mode";
    return false;
}

// 2. Chat Logic
function addMessage(text, sender) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="msg-content">${text}</div><div class="msg-time">${time} ${sender === 'user' ? '✓✓' : ''}</div>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getGeminiResponse(prompt) {
    if (!activeModelUrl) {
        const found = await discoverNeuralLink();
        if (!found) return getOfflineResponse(prompt);
    }

    statusText.textContent = "typing...";
    try {
        const response = await fetch(`${activeModelUrl}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        return getOfflineResponse(prompt);
    } finally {
        statusText.textContent = "online";
    }
}

function getOfflineResponse(prompt) {
    const responses = [
        "Bhai, API response nahi de rahi, shayad key restricted hai. Ek baar AI Studio mein permissions check kijiye.",
        "System busy. Offline neural nodes active hain. Aapne poocha: " + prompt,
        "LUNAR is running on local backup intelligence. Connectivity is low.",
        "Bhai, Google servers block kar rahe hain. Shayad key mein koi issue hai."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

async function processCommand(input) {
    if (!input.trim()) return;
    addMessage(input, 'user');
    userInput.value = '';
    const res = await getGeminiResponse(input);
    addMessage(res, 'lunar'); speak(res);
}

function speak(text) {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utter.voice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
    synth.speak(utter);
}

if (recognition) {
    recognition.onresult = (e) => processCommand(e.results[e.results.length - 1][0].transcript);
    recognition.onstart = () => { isListening = true; statusText.textContent = "listening..."; };
    recognition.onend = () => { isListening = false; statusText.textContent = "online"; };
}

sendBtn.addEventListener('click', () => processCommand(userInput.value));
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') processCommand(userInput.value); });
voiceBtn.addEventListener('click', () => { if (isListening) recognition.stop(); else recognition.start(); });

window.onload = () => {
    discoverNeuralLink();
    addMessage("LUNAR v8.0: Discovery Module Active. Scanning Brain...", 'lunar');
};
