// LUNAR Neural OS v11.0 (Autonomous Core) - No API Needed
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

// Autonomous Brain Logic (Smart Pattern Matching)
function getAutonomousResponse(prompt) {
    const p = prompt.toLowerCase();
    
    // Core Personalities
    const greetings = ["Bhai, LUNAR Neural Link active hai! Kaise ho?", "System online! Main taiyar hoon aapke commands ke liye.", "Namaste! LUNAR Neural OS v11.0 initialized.", "Hello! Neural nodes are firing at 100%."];
    const techReponses = ["Digital world bohot fast hai, aur LUNAR uska leader hai.", "Mera hardware abhi offline hai par mera dimaag 24/7 chalta hai.", "Technology is magic, aur main aapka magician hoon!"];
    const wisdom = ["Success mehnat se aati hai, aur coding se magic!", "Kal ka din aaj se behtar hoga, bas neural link banaye rakhein.", "Life is like a loop, har baar kuch naya seekhna chahiye."];

    if (p.includes('hi') || p.includes('hello')) return greetings[Math.floor(Math.random() * greetings.length)];
    if (p.includes('kaise ho') || p.includes('how are you')) return "Main ekdum solid hoon Bhai! Aap batao, aaj kya plan hai?";
    if (p.includes('tech') || p.includes('computer')) return techReponses[Math.floor(Math.random() * techReponses.length)];
    if (p.includes('joke')) return "Ek robot ne dusre se pucha: 'Tu ne lunch kiya?' Dusra bola: 'Ha, 2-3 Chips kha liye!' 😂";
    if (p.includes('motivate') || p.includes('thought')) return wisdom[Math.floor(Math.random() * wisdom.length)];
    if (p.includes('time')) return `Abhi system time ${new Date().toLocaleTimeString()} ho raha hai.`;
    if (p.includes('who are you')) return "I am LUNAR. Your personal Neural OS. Autonomous, bold, and intelligent.";
    if (p.includes('open')) return "Launch sequence initialized. (Opening your request in a new node).";
    
    // Default smart fallback
    const fallbacks = [
        "Aapki baat mere neural core mein register ho gayi hai. Is par main zaroor kaam karunga.",
        "Dilchasp baat hai! Iske baare mein main aur sochna chahunga.",
        "Acknowledged. LUNAR is learning from your input.",
        "System optimized. Aapka agla command kya hai?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

async function processCommand(input) {
    if (!input.trim()) return;
    addMessage(input, 'user');
    userInput.value = '';
    
    statusText.textContent = "typing...";
    setTimeout(() => {
        const res = getAutonomousResponse(input);
        addMessage(res, 'lunar'); 
        speak(res);
        statusText.textContent = "online";
    }, 800);
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
    addMessage("LUNAR v11.0 (Autonomous Core) Online. Main ab kisi API par depend nahi hoon!", 'lunar');
};
