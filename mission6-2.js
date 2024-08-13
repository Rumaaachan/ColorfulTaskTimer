document.addEventListener("DOMContentLoaded", function() {
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const taskHistoryElement = document.getElementById('task-history');

    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 時間が少なくなるにつれて色を変更
        if (timeLeft > 10 * 60) {
            timerDisplay.style.color = 'green'; // 10分以上は緑
        } else if (timeLeft > 5 * 60) {
            timerDisplay.style.color = 'orange'; // 5分以上10分未満はオレンジ
        } else {
            timerDisplay.style.color = 'red'; // 5分未満は赤
        }
    }

    function startTimer() {
        if (isRunning) return;

        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                saveTaskCompletion();
                alert('タイマーが終了しました！');
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = 25 * 60;
        updateTimerDisplay();
        isRunning = false;
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function setCookie(name, value) {
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/";
    }

    function saveTaskCompletion() {
        const now = new Date().toLocaleString();
        let taskHistory = JSON.parse(getCookie('taskHistory') || '[]');
        taskHistory.push(now);
        setCookie('taskHistory', JSON.stringify(taskHistory));
        displayTaskHistory();
    }

    function displayTaskHistory() {
        const taskHistory = JSON.parse(getCookie('taskHistory') || '[]');
        taskHistoryElement.innerHTML = '';
        taskHistory.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;

            // ランダムな色を適用
            li.style.color = getRandomColor();

            taskHistoryElement.appendChild(li);
        });
    }

    // ランダムな色を生成する関数
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    displayTaskHistory();
    updateTimerDisplay();
});
