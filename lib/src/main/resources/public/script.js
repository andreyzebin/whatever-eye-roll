let ws = null;
const serverUrl = 'ws://' + window.location.host + '/avatar-stream';
let customUpdateTimeout = null;
const CUSTOM_UPDATE_DELAY = 100; // Задержка перед отправкой в мс

function updateCustomValue(sliderId) {
    const value = document.getElementById(sliderId).value;
    document.getElementById(sliderId + 'Value').textContent = value;

    // Отправляем команду с задержкой для избежания спама
    if (customUpdateTimeout) {
        clearTimeout(customUpdateTimeout);
    }

    customUpdateTimeout = setTimeout(sendCustomCommand, CUSTOM_UPDATE_DELAY);
}

function sendCustomCommand() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        return; // Не показываем alert, просто игнорируем
    }

    const state = {
        eyeOpen: parseFloat(document.getElementById('eyeOpen').value),
        eyeRoll: parseFloat(document.getElementById('eyeRoll').value),
        browAngle: parseFloat(document.getElementById('browAngle').value),
        browDist: parseFloat(document.getElementById('browDist').value),
        mouthCurve: parseFloat(document.getElementById('mouthCurve').value),
        mouthOpen: parseFloat(document.getElementById('mouthOpen').value),
        pupilX: parseFloat(document.getElementById('pupilX').value),
        tilt: parseFloat(document.getElementById('tilt').value)
    };

    const message = {
        timestamp: Date.now() / 1000,
        state: state,
        duration: 0.1, // Быстрая анимация для плавности
        interpolation: 'linear'
    };

    ws.send(JSON.stringify(message));
}

function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        alert('Уже подключено!');
        return;
    }

    try {
        ws = new WebSocket(serverUrl);

        ws.onopen = function() {
            updateStatus('connected', '✅ Подключено к серверу');
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = function(event) {
            // Обновляем SVG
            document.getElementById('avatarDisplay').innerHTML = event.data;
        };

        ws.onclose = function() {
            updateStatus('disconnected', '❌ Отключено от сервера');
            console.log('WebSocket connection closed');
        };

        ws.onerror = function(error) {
            updateStatus('disconnected', '❌ Ошибка подключения');
            console.error('WebSocket error:', error);
            alert('Ошибка подключения к серверу. Убедитесь, что сервер запущен на порту 8080.');
        };

    } catch (error) {
        console.error('Connection error:', error);
        alert('Ошибка при подключении: ' + error.message);
    }
}

function disconnect() {
    if (ws) {
        ws.close();
        ws = null;
    }
    updateStatus('disconnected', '❌ Не подключено');
}

function updateStatus(status, message) {
    const statusEl = document.getElementById('connectionStatus');
    statusEl.className = 'status ' + status;
    statusEl.textContent = message;
}

function sendCommand(type) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('Сначала подключитесь к серверу!');
        return;
    }

    const commands = {
        'happy': {
            state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 0.0, browDist: 0.0,
                    mouthCurve: -0.8, mouthOpen: 0.3, pupilX: 0.0, tilt: 0.0 },
            duration: 0.3,
            interpolation: 'easeOut'
        },
        'sad': {
            state: { eyeOpen: 0.7, eyeRoll: 0.0, browAngle: 10.0, browDist: 3.0,
                    mouthCurve: 0.8, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0 },
            duration: 0.4,
            interpolation: 'easeIn'
        },
        'angry': {
            state: { eyeOpen: 0.8, eyeRoll: 0.0, browAngle: -30.0, browDist: -5.0,
                    mouthCurve: 0.2, mouthOpen: 0.05, pupilX: 0.0, tilt: 0.0 },
            duration: 0.2,
            interpolation: 'easeOut'
        },
        'surprised': {
            state: { eyeOpen: 1.2, eyeRoll: 0.0, browAngle: 15.0, browDist: -2.0,
                    mouthCurve: 0.0, mouthOpen: 0.6, pupilX: 0.0, tilt: 0.0 },
            duration: 0.2,
            interpolation: 'easeOut'
        }
    };

    const command = commands[type];
    if (command) {
        const message = {
            timestamp: Date.now() / 1000,
            ...command
        };
        ws.send(JSON.stringify(message));
        console.log('Sent command:', type, message);
    }
}

// Автоподключение при загрузке страницы
window.addEventListener('load', function() {
    // connect(); // Раскомментируйте для автоматического подключения
});