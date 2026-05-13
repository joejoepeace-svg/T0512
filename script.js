// Elements
const buttonsContainer = document.getElementById('buttons-container');
const board = document.getElementById('result-board');
const modeStudyBtn = document.getElementById('mode-study');
const modeQuizBtn = document.getElementById('mode-quiz');
const studyView = document.getElementById('study-view');
const quizView = document.getElementById('quiz-view');

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('quiz-feedback');

// State
let score = 0;
let currentCorrectAnswer = 0;
const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd', '#54a0ff'];

// --- Audio Context for "Pyororong" sound ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPyororong() {
    const now = audioCtx.currentTime;
    const duration = 0.1;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Ascending Arpeggio)
    
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        
        gain.gain.setValueAtTime(0.3, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + duration);
    });
}

function playWrongSound() {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
}

// --- Mode Switching ---
modeStudyBtn.onclick = () => {
    modeStudyBtn.classList.add('active');
    modeQuizBtn.classList.remove('active');
    studyView.classList.remove('hidden');
    quizView.classList.add('hidden');
};

modeQuizBtn.onclick = () => {
    modeQuizBtn.classList.add('active');
    modeStudyBtn.classList.remove('active');
    quizView.classList.remove('hidden');
    studyView.classList.add('hidden');
    startNewQuestion();
};

// --- Study Mode Logic ---
for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = `btn btn-${i}`;
    btn.textContent = `${i}단`;
    btn.onclick = () => showGugudan(i);
    buttonsContainer.appendChild(btn);
}

function showGugudan(dan) {
    board.innerHTML = '';
    createConfetti();
    for (let i = 1; i <= 9; i++) {
        const item = document.createElement('div');
        item.className = 'gugu-item';
        item.innerHTML = `${dan} &times; ${i} = <strong>${dan * i}</strong>`;
        item.style.animationDelay = `${i * 0.05}s`;
        item.style.borderColor = colors[i % colors.length];
        board.appendChild(item);
    }
}

// --- Quiz Mode Logic ---
function startNewQuestion() {
    const dan = Math.floor(Math.random() * 8) + 2; // 2~9단
    const num = Math.floor(Math.random() * 9) + 1; // 1~9곱
    currentCorrectAnswer = dan * num;
    
    questionEl.innerHTML = `${dan} &times; ${num} = <span style="color:#ff4757">?</span>`;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    // Generate choices
    let choices = [currentCorrectAnswer];
    while (choices.length < 4) {
        const wrong = (Math.floor(Math.random() * 8) + 2) * (Math.floor(Math.random() * 9) + 1);
        if (!choices.includes(wrong)) {
            choices.push(wrong);
        }
    }
    
    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);
    
    choicesEl.innerHTML = '';
    choices.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = val;
        btn.onclick = () => handleChoice(val, btn);
        choicesEl.appendChild(btn);
    });
}

function handleChoice(selected, btn) {
    if (selected === currentCorrectAnswer) {
        score += 10;
        scoreEl.textContent = score;
        feedbackEl.textContent = '정답이에요! 뾰로롱~ ✨';
        feedbackEl.className = 'feedback correct';
        playPyororong();
        createConfetti();
        
        // Disable all buttons and move to next question
        const allBtns = choicesEl.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.disabled = true);
        btn.style.background = '#2ed573';
        btn.style.color = 'white';
        
        setTimeout(startNewQuestion, 1500);
    } else {
        feedbackEl.textContent = '아쉽지만 다시 해봐요! 😢';
        feedbackEl.className = 'feedback wrong';
        playWrongSound();
        btn.style.background = '#ff4757';
        btn.style.color = 'white';
        btn.disabled = true;
    }
}

// --- Effects ---
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = `${Math.random() * 10 + 5}px`;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = '-10px';
        particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }
}
