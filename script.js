// Elements
const buttonsContainer = document.getElementById('buttons-container');
const board = document.getElementById('result-board');
const modeStudyBtn = document.getElementById('mode-study');
const modeQuizBtn = document.getElementById('mode-quiz');
const studyView = document.getElementById('study-view');
const quizView = document.getElementById('quiz-view');
const victoryScreen = document.getElementById('victory-screen');
const restartBtn = document.getElementById('restart-btn');

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('quiz-feedback');

// State
let score = 0;
let currentCorrectAnswer = 0;
const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd', '#54a0ff'];

// --- Audio Context for Sounds ---
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 경쾌한 정답 소리 (Pyororong 2.0)
function playPyororong() {
    initAudio();
    const now = audioCtx.currentTime;
    const duration = 0.15;
    // 좀 더 경쾌하고 통통 튀는 음계 (C5, E5, G5, C6, E6)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; 
    
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        
        gain.gain.setValueAtTime(0, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + duration);
    });
}

// 만점 달성 시 활기찬 소리 (Victory Fanfare)
function playVictorySound() {
    initAudio();
    const now = audioCtx.currentTime;
    // 활기찬 느낌의 코드 진행
    const notes = [
        {f: 523.25, t: 0},    // C5
        {f: 659.25, t: 0.1},  // E5
        {f: 783.99, t: 0.2},  // G5
        {f: 1046.50, t: 0.3}, // C6
        {f: 783.99, t: 0.4},  // G5
        {f: 1046.50, t: 0.5}, // C6
        {f: 1318.51, t: 0.6}  // E6 (Final high note)
    ];
    
    notes.forEach((note) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'square'; // 좀 더 활기차고 레트로한 느낌을 위해 square 타입 사용
        osc.frequency.setValueAtTime(note.f, now + note.t);
        
        gain.gain.setValueAtTime(0, now + note.t);
        gain.gain.linearRampToValueAtTime(0.15, now + note.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.t + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + note.t);
        osc.stop(now + note.t + 0.4);
    });
}

function playWrongSound() {
    initAudio();
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
    victoryScreen.classList.add('hidden');
};

modeQuizBtn.onclick = () => {
    modeQuizBtn.classList.add('active');
    modeStudyBtn.classList.remove('active');
    quizView.classList.remove('hidden');
    studyView.classList.add('hidden');
    resetQuiz();
};

restartBtn.onclick = () => {
    victoryScreen.classList.add('hidden');
    resetQuiz();
};

function resetQuiz() {
    score = 0;
    scoreEl.textContent = score;
    startNewQuestion();
}

// --- Study Mode Logic ---
for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = `btn btn-${i}`;
    btn.textContent = `${i}단`;
    btn.onclick = () => {
        initAudio(); // 첫 클릭 시 오디오 컨텍스트 초기화
        showGugudan(i);
    };
    buttonsContainer.appendChild(btn);
}

function showGugudan(dan) {
    board.innerHTML = '';
    createConfetti(30);
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
    const dan = Math.floor(Math.random() * 8) + 2; 
    const num = Math.floor(Math.random() * 9) + 1; 
    currentCorrectAnswer = dan * num;
    
    questionEl.innerHTML = `${dan} &times; ${num} = <span style="color:#ff4757">?</span>`;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    let choices = [currentCorrectAnswer];
    while (choices.length < 4) {
        const wrong = (Math.floor(Math.random() * 8) + 2) * (Math.floor(Math.random() * 9) + 1);
        if (!choices.includes(wrong)) {
            choices.push(wrong);
        }
    }
    
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
    initAudio();
    if (selected === currentCorrectAnswer) {
        score += 10;
        scoreEl.textContent = score;
        
        if (score >= 200) {
            showVictory();
        } else {
            feedbackEl.textContent = '정답이에요! 뾰로롱~ ✨';
            feedbackEl.className = 'feedback correct';
            playPyororong();
            createConfetti(20);
            
            const allBtns = choicesEl.querySelectorAll('.choice-btn');
            allBtns.forEach(b => b.disabled = true);
            btn.style.background = '#2ed573';
            btn.style.color = 'white';
            
            setTimeout(startNewQuestion, 1200);
        }
    } else {
        feedbackEl.textContent = '아쉽지만 다시 해봐요! 😢';
        feedbackEl.className = 'feedback wrong';
        playWrongSound();
        btn.style.background = '#ff4757';
        btn.style.color = 'white';
        btn.disabled = true;
    }
}

function showVictory() {
    victoryScreen.classList.remove('hidden');
    playVictorySound();
    createConfetti(100); // 만점 축하용 대량 색종이
}

// --- Effects ---
function createConfetti(count) {
    for (let i = 0; i < count; i++) {
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
        setTimeout(() => particle.remove(), 2500);
    }
}
