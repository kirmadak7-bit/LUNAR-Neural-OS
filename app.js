// LUNAR Neural OS v7.0 (Neural Evolution)
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

// Advanced Neural Fetch
async function getGeminiResponse(prompt) {
    statusText.textContent = "typing...";
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("API Link Failed");
        }
    } catch (e) {
        return getDynamicOfflineResponse(prompt);
    } finally {
        statusText.textContent = "online";
    }
}

// Dynamic Offline Brain (When API Fails)
function getDynamicOfflineResponse(prompt) {
    const responses = [
        "System link thoda unstable hai, par main aapki baat samajh raha hoon. Kya hum offline mode mein continue karein?",
        "Neural sync error. Lekin mere local nodes active hain. Aapne kaha: " + prompt,
        "Interesting point. Mera brain thoda connectivity issue face kar raha hai, par main active hoon.",
        "Aapki request acknowledged. Main offline intelligence use kar raha hoon abhi.",
        "Bhai, API connection mein dikat hai, par LUNAR har nahi maanega. Poochiye kya poochna hai!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
    addMessage("LUNAR V7 (Neural Evolution) Online. System is ready.", 'lunar');
};
