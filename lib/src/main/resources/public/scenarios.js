// Файл сценариев анимации
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
    ],
    'annoyed': [
        // Начало: нормальное выражение
        { state: { eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 0.0, browDist: 0.0,
                  mouthCurve: 0.0, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0 },
          duration: 0.2, interpolation: 'easeOut' },

        // Подготовка: брови поднимаются в удивлении
        { state: { eyeOpen: 1.1, eyeRoll: 0.0, browAngle: 15.0, browDist: -2.0,
                  mouthCurve: 0.1, mouthOpen: 0.3, pupilX: 0.0, tilt: 3.0 },
          duration: 0.3, interpolation: 'easeOut' },

        // Пик драмы: широко открытые глаза и рот, закатывание глаз
        { state: { eyeOpen: 1.3, eyeRoll: 0.9, browAngle: 20.0, browDist: -3.0,
                  mouthCurve: 0.0, mouthOpen: 0.9, pupilX: 0.0, tilt: 8.0 },
          duration: 0.4, interpolation: 'easeInOut' },

        // Задержка в максимальной драме
        { state: { eyeOpen: 1.3, eyeRoll: 0.9, browAngle: 20.0, browDist: -3.0,
                  mouthCurve: 0.0, mouthOpen: 0.9, pupilX: 0.0, tilt: 8.0 },
          duration: 0.5, interpolation: 'linear' },

        // Возврат: глаза возвращаются, рот еще приоткрыт
        { state: { eyeOpen: 1.1, eyeRoll: 0.2, browAngle: 10.0, browDist: -1.0,
                  mouthCurve: 0.2, mouthOpen: 0.4, pupilX: 0.0, tilt: 2.0 },
          duration: 0.4, interpolation: 'easeInOut' },

        // Финальное выражение: легкое раздражение
        { state: { eyeOpen: 0.9, eyeRoll: 0.0, browAngle: -10.0, browDist: -2.0,
                  mouthCurve: 0.3, mouthOpen: 0.2, pupilX: 0.0, tilt: 0.0 },
          duration: 0.3, interpolation: 'easeIn' },

        // Завершение: возврат к нейтральному с легким намеком на drama
        { state: { eyeOpen: 0.8, eyeRoll: 0.0, browAngle: -5.0, browDist: -1.0,
                  mouthCurve: 0.1, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0 },
          duration: 0.4, interpolation: 'easeIn' }
    ]
};

function playScenario(scenarioName) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('Сначала подключитесь к серверу!');
        return;
    }

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
            }, index * 800); // Уменьшил задержку до 0.8 сек для более динамичной анимации
        });
    }
}