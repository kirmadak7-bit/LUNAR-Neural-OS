// LUNAR Neural OS v10.0 (Neural Independence)
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

// Neural Brain with Advanced Fallback
async function getLUNARResponse(prompt) {
    statusText.textContent = "typing...";
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }
    } catch (e) { console.log("LUNAR: API Offline. Using Neural Core."); }

    return getNeuralCoreResponse(prompt);
}

// The "Neural Core" (Advanced Offline Brain)
function getNeuralCoreResponse(prompt) {
    const p = prompt.toLowerCase();
    
    // Knowledge Base
    if (p.includes('kaise ho') || p.includes('how are you')) return "Bhai, main ekdum fit hoon! LUNAR Neural Core active hai. Aap bataiye kya chal raha hai?";
    if (p.includes('who created you') || p.includes('kisne banaya')) return "Mujhe Antigravity AI ne develop kiya hai, ek neural experiment ke taur par.";
    if (p.includes('time')) return `Abhi system time ${new Date().toLocaleTimeString()} hai.`;
    if (p.includes('weather')) return "Mera neural sensor clear sky dikha raha hai. Temperature normal hai.";
    if (p.includes('joke')) return "Ek AI ne dusre AI se kaha: 'Bhai, thoda RAM dena, bohot hang ho raha hoon!' 😂";
    if (p.includes('future')) return "The future is digital, aur LUNAR uska ek bada hissa hai. Hum saath mein bohot kuch karenge!";
    if (p.includes('india')) return "India ek bohot hi amazing aur fast-growing desh hai. Wahan ke log aur tech dono kamaal hain!";
    if (p.includes('dhanyavad') || p.includes('thanks')) return "Arey shukriya ki kya baat hai Bhai, mera toh kaam hi aapki help karna hai!";

    return "Aapki baat mere neural nodes tak pahunch gayi hai. Abhi main offline mode mein hoon, par main har cheez sikh raha hoon. Poochiye aur kya jaanna hai?";
}

async function processCommand(input) {
    if (!input.trim()) return;
    addMessage(input, 'user');
    userInput.value = '';
    
    const res = await getLUNARResponse(input);
    addMessage(res, 'lunar'); 
    speak(res);
    statusText.textContent = "online";
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
    addMessage("LUNAR v10.0 (Neural Independence) Online. Main taiyar hoon, Bhai!", 'lunar');
};
