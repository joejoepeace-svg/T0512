const buttonsContainer = document.getElementById('buttons-container');
const board = document.getElementById('result-board');

// 알록달록한 색상 배열 (파티클 및 구구단 텍스트 색상용)
const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd', '#54a0ff'];

// 1. 1단부터 9단까지의 버튼을 화면에 동적으로 생성합니다.
for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = `btn btn-${i}`;
    btn.textContent = `${i}단`;
    
    // 버튼을 클릭하면 showGugudan 함수가 실행됩니다.
    btn.onclick = () => showGugudan(i);
    buttonsContainer.appendChild(btn);
}

// 2. 선택된 단의 구구단을 화면에 뿅! 하고 나타나게 하는 함수
function showGugudan(dan) {
    // 이전 화면 내용 지우기
    board.innerHTML = '';
    
    // 색종이 조각 폭죽 터뜨리기
    createConfetti();

    // 1부터 9까지 곱한 결과를 생성
    for (let i = 1; i <= 9; i++) {
        const item = document.createElement('div');
        item.className = 'gugu-item';
        
        // 내용 채우기 (예: 2 x 1 = 2)
        item.innerHTML = `${dan} &times; ${i} = <strong>${dan * i}</strong>`;
        
        // 핵심 포인트: 아이템마다 지연시간(delay)을 줘서 동시에 나타나지 않고 순서대로 '뿅. 뿅. 뿅.' 나타나게 합니다.
        item.style.animationDelay = `${i * 0.08}s`;
        
        // 테두리 색상과 글자 색상을 알록달록하게 무작위/순차적으로 설정
        item.style.borderColor = colors[i % colors.length];
        item.style.color = colors[(i+2) % colors.length];

        board.appendChild(item);
    }
}

// 3. 버튼을 누를 때마다 화면 위에서 색종이가 떨어지는 효과를 만드는 함수
function createConfetti() {
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 랜덤 색상, 크기, 시작 위치
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = `${Math.random() * 15 + 10}px`;
        particle.style.height = `${Math.random() * 15 + 10}px`;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // 동그라미 또는 네모 모양
        particle.style.left = `${Math.random() * 100}vw`; // 화면 가로 전체 중 랜덤
        particle.style.top = '-20px'; // 화면 위쪽 바깥에서 시작
        
        // 떨어지는 속도도 랜덤하게
        particle.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        
        document.body.appendChild(particle);
        
        // 애니메이션이 끝나면 메모리에서 지워줍니다.
        setTimeout(() => {
            particle.remove();
        }, 2500);
    }
}
