class AvatarStreamClient {
    constructor(url) {
        this.ws = new WebSocket(url);
        this.svgContainer = document.getElementById('avatar-container');

        this.ws.onmessage = (event) => {
            this.svgContainer.innerHTML = event.data;
        };

        this.ws.onopen = () => {
            console.log('Connected to avatar stream');
        };
    }

    sendCommand(state, duration = 0.5, interpolation = 'easeInOut') {
        const command = {
            timestamp: Date.now() / 1000,
            state: state,
            duration: duration,
            interpolation: interpolation
        };
        this.ws.send(JSON.stringify(command));
    }

    // Вспомогательные методы для быстрых команд
    smile() {
        this.sendCommand({
            eyeOpen: 1.0, eyeRoll: 0.0, browAngle: 0.0, browDist: 0.0,
            mouthCurve: -0.8, mouthOpen: 0.3, pupilX: 0.0, tilt: 0.0
        }, 0.3, 'easeOut');
    }

    sad() {
        this.sendCommand({
            eyeOpen: 0.7, eyeRoll: 0.0, browAngle: 10.0, browDist: 3.0,
            mouthCurve: 0.8, mouthOpen: 0.1, pupilX: 0.0, tilt: 0.0
        }, 0.4, 'easeIn');
    }

    // ... другие эмоции
}