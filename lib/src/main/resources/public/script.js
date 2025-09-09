let ws = null;
const serverUrl = 'ws://' + window.location.host + '/avatar-stream';

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

function playScenario(scenarioName) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('Сначала подключитесь к серверу!');
        return;
    }

    const scenarios = {
        'greeting': [
            { state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 0.0, browDist: 0.0,
                      mouthCurve: -0.8, mouthOpen: 0.3, pupilX: 0.0, tilt: 0.0 },
              duration: 0.3, interpolation: 'easeOut' },
            { state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 5.0, browDist: -1.0,
                      mouthCurve: -0.8, mouthOpen: 0.1, pupilX: 0.0, tilt: 5.0 },
              duration: 0.2, interpolation: 'easeInOut' },
            { state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 0.0, browDist: 0.0,
                      mouthCurve: 0.0, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0 },
              duration: 0.3, interpolation: 'easeIn' }
        ],
        'thinking': [
            { state: { eyeOpen: 0.8, eyeRoll: 0.3, browAngle: 5.0, browDist: 2.0,
                      mouthCurve: 0.0, mouthOpen: 0.1, pupilX: 0.2, tilt: -5.0 },
              duration: 0.4, interpolation: 'easeInOut' },
            { state: { eyeOpen: 0.9, eyeRoll: -0.2, browAngle: 8.0, browDist: 1.0,
                      mouthCurve: 0.1, mouthOpen: 0.05, pupilX: -0.1, tilt: 5.0 },
              duration: 0.6, interpolation: 'easeInOut' },
            { state: { eyeOpen: 0.8, eyeRoll: 0.0, browAngle: 3.0, browDist: 1.5,
                      mouthCurve: 0.0, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0 },
              duration: 0.4, interpolation: 'easeIn' }
        ],
        'laughing': [
            { state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: -5.0, browDist: -1.0,
                      mouthCurve: -1.0, mouthOpen: 0.8, pupilX: 0.0, tilt: 0.0 },
              duration: 0.2, interpolation: 'easeOut' },
            { state: { eyeOpen: 0.7, eyeRoll: 0.1, browAngle: -8.0, browDist: -2.0,
                      mouthCurve: -0.9, mouthOpen: 0.6, pupilX: 0.1, tilt: 2.0 },
              duration: 0.1, interpolation: 'easeInOut' },
            { state: { eyeOpen: 1.0, eyeRoll: -0.1, browAngle: -5.0, browDist: -1.0,
                      mouthCurve: -1.0, mouthOpen: 0.7, pupilX: -0.1, tilt: -2.0 },
              duration: 0.1, interpolation: 'easeInOut' },
            { state: { eyeOpen: 0.9, eyeRoll: 0.0, browAngle: -3.0, browDist: 0.0,
                      mouthCurve: -0.5, mouthOpen: 0.2, pupilX: 0.0, tilt: 0.0 },
              duration: 0.3, interpolation: 'easeIn' }
        ],
        'sleeping': [
            { state: { eyeOpen: 0.3, eyeRoll: 0.0, browAngle: 2.0, browDist: 1.0,
                      mouthCurve: 0.2, mouthOpen: 0.05, pupilX: 0.0, tilt: 0.0 },
              duration: 0.5, interpolation: 'easeInOut' },
            { state: { eyeOpen: 0.1, eyeRoll: 0.0, browAngle: 1.0, browDist: 0.5,
                      mouthCurve: 0.3, mouthOpen: 0.1, pupilX: 0.0, tilt: 5.0 },
              duration: 0.8, interpolation: 'easeInOut' },
            { state: { eyeOpen: 0.2, eyeRoll: 0.0, browAngle: 2.0, browDist: 1.0,
                      mouthCurve: 0.2, mouthOpen: 0.05, pupilX: 0.0, tilt: -5.0 },
              duration: 0.7, interpolation: 'easeInOut' }
        ]
    };

    const scenario = scenarios[scenarioName];
    if (scenario) {
        console.log('Playing scenario:', scenarioName);

        // Отправляем каждый кадр сценария
        scenario.forEach((frame, index) => {
            setTimeout(() => {
                const message = {
                    timestamp: Date.now() / 1000,
                    ...frame
                };
                ws.send(JSON.stringify(message));
                console.log('Sent frame:', index, message);
            }, index * 1000); // Задержка между кадрами 1 секунда
        });
    }
}

function updateCustomValue(sliderId) {
    const value = document.getElementById(sliderId).value;
    document.getElementById(sliderId + 'Value').textContent = value;
}

function sendCustomCommand() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('Сначала подключитесь к серверу!');
        return;
    }

    const state = {
        eyeOpen: parseFloat(document.getElementById('eyeOpen').value),
        eyeRoll: 0.0,
        browAngle: 0.0,
        browDist: 0.0,
        mouthCurve: parseFloat(document.getElementById('mouthCurve').value),
        mouthOpen: parseFloat(document.getElementById('mouthOpen').value),
        pupilX: 0.0,
        tilt: 0.0
    };

    const message = {
        timestamp: Date.now() / 1000,
        state: state,
        duration: 0.3,
        interpolation: 'easeInOut'
    };

    ws.send(JSON.stringify(message));
    console.log('Sent custom command:', message);
}

// Автоподключение при загрузке страницы
window.addEventListener('load', function() {
    // connect(); // Раскомментируйте для автоматического подключения
});