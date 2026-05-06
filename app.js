// LUNAR Neural OS v12.0 (Neural Proxy - Force Connect)
const GEMINI_API_KEY = 'AIzaSyBX7QvS90QNFqtuFZsG3QVCC5L7s8ytM2Y';
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;
const synth = window.speechSynthesis;

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const statusText = document.getElementById('lunar-status');

let isListening = false;

function addMessage(text, sender) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="msg-content">${text}</div><div class="msg-time">${time} ${sender === 'user' ? '✓✓' : ''}</div>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// v12.0 Force-Connect Logic
async function getGeminiResponse(prompt) {
    statusText.textContent = "typing...";
    try {
        // Try the most direct and simple v1beta call (Google AI Studio Standard)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Respond naturally and smartly like an AI OS to: ${prompt}` }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } else {
            const err = await response.json();
            throw new Error(err.error?.message || "Connection Denied");
        }
    } catch (e) {
        console.error("Gemini Error:", e);
        // If API fails, use a "Smart Local AI" that's better than v11
        return getSmartLocalResponse(prompt);
    } finally {
        statusText.textContent = "online";
    }
}

// Improved Local Brain
function getSmartLocalResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('time')) return `The current time is ${new Date().toLocaleTimeString()}.`;
    if (p.includes('date')) return `Today's date is ${new Date().toLocaleDateString()}.`;
    
    return "Bhai, LUNAR Neural Link (Gemini) abhi bhi block ho raha hai. Iska matlab aapki API Key restricted hai. Ek baar AI Studio mein jaakar 'Enable API' button check kijiye. Tab tak main basic help kar sakta hoon.";
}

async function processCommand(input) {
    if (!input.trim()) return;
    addMessage(input, 'user');
    userInput.value = '';
    const res = await getGeminiResponse(input);
    addMessage(res, 'lunar'); speak(res);
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

sendBtn.addEventListener('click', () => processCommand(userInput.value));
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') processCommand(userInput.value); });
voiceBtn.addEventListener('click', () => {
    if (isListening) { recognition.stop(); isListening = false; }
    else { recognition.start(); isListening = true; }
});

window.onload = () => {
    addMessage("LUNAR v12.0 (Neural Proxy) Online. System Re-connected.", 'lunar');
};
