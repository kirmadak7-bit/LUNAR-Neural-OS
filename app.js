// LUNAR Neural OS v13.0 (User Configurable Brain)
let GEMINI_API_KEY = localStorage.getItem('LUNAR_API_KEY') || 'AIzaSyBX7QvS90QNFqtuFZsG3QVCC5L7s8ytM2Y';

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;
const synth = window.speechSynthesis;

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const statusText = document.getElementById('lunar-status');

// Settings UI Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const closeSettings = document.getElementById('close-settings');

function addMessage(text, sender) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="msg-content">${text}</div><div class="msg-time">${time} ${sender === 'user' ? '✓✓' : ''}</div>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Global Gemini Call
async function getGeminiResponse(prompt) {
    statusText.textContent = "typing...";
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (response.ok) {
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("API Blocked");
        }
    } catch (e) {
        return "LUNAR Brain offline. Please update your API Key in Settings (⚙️).";
    } finally {
        statusText.textContent = "online";
    }
}

async function processCommand(input) {
    if (!input.trim()) return;
    addMessage(input, 'user');
    userInput.value = '';
    const res = await getGeminiResponse(input);
    addMessage(res, 'lunar'); 
    speak(res);
}

function speak(text) {
    try {
        if (synth.speaking) synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        utter.voice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
        synth.speak(utter);
    } catch (e) {}
}

// Settings Logic
settingsBtn.onclick = () => {
    settingsModal.style.display = 'block';
    apiKeyInput.value = GEMINI_API_KEY;
};

closeSettings.onclick = () => settingsModal.style.display = 'none';

saveKeyBtn.onclick = () => {
    const newKey = apiKeyInput.value.trim();
    if (newKey) {
        GEMINI_API_KEY = newKey;
        localStorage.setItem('LUNAR_API_KEY', newKey);
        alert("Neural Link Updated! Refreshing...");
        location.reload();
    }
};

sendBtn.addEventListener('click', () => processCommand(userInput.value));
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') processCommand(userInput.value); });
voiceBtn.addEventListener('click', () => {
    if (recognition) recognition.start();
});

window.onload = () => {
    addMessage("LUNAR v13.0 (Settings Edition). Update your brain in Neural Settings (⚙️).", 'lunar');
};
