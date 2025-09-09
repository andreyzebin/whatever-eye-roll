package org.example;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
public class AvatarAnimationPlayer {
    private AvatarState currentState;
    private AvatarState targetState;
    private long transitionStartTime;
    private long transitionDuration;
    private String interpolationType = "linear";
    private boolean isAnimating = false;

    public AvatarAnimationPlayer() {
        currentState = new AvatarState(1.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0);
        targetState = currentState;
    }

    public void addTargetState(LLMCommand command) {
        this.targetState = command.getState();
        this.transitionStartTime = System.currentTimeMillis();
        this.transitionDuration = (long)(command.getDuration() * 1000);
        this.interpolationType = command.getInterpolation() != null ?
                command.getInterpolation() : "linear";
        this.isAnimating = true;
    }

    public String getCurrentSvg() {
        updateCurrentState();
        return AvatarTemplateRenderer.render(
                currentState.getEyeOpen(),
                currentState.getEyeRoll(),
                currentState.getBrowAngle(),
                currentState.getBrowDist(),
                currentState.getMouthCurve(),
                currentState.getMouthOpen(),
                currentState.getPupilX(),
                currentState.getTilt()
        );
    }

    public boolean updateCurrentState() {
        if (!isAnimating || currentState.equals(targetState)) {
            isAnimating = false;
            return false;
        }

        long elapsed = System.currentTimeMillis() - transitionStartTime;
        double progress = Math.min(1.0, (double)elapsed / transitionDuration);
        double t = applyInterpolation(progress, interpolationType);

        currentState.setEyeOpen(interpolate(currentState.getEyeOpen(), targetState.getEyeOpen(), t));
        currentState.setEyeRoll(interpolate(currentState.getEyeRoll(), targetState.getEyeRoll(), t));
        currentState.setBrowAngle(interpolate(currentState.getBrowAngle(), targetState.getBrowAngle(), t));
        currentState.setBrowDist(interpolate(currentState.getBrowDist(), targetState.getBrowDist(), t));
        currentState.setMouthCurve(interpolate(currentState.getMouthCurve(), targetState.getMouthCurve(), t));
        currentState.setMouthOpen(interpolate(currentState.getMouthOpen(), targetState.getMouthOpen(), t));
        currentState.setPupilX(interpolate(currentState.getPupilX(), targetState.getPupilX(), t));
        currentState.setTilt(interpolate(currentState.getTilt(), targetState.getTilt(), t));

        // Проверяем, завершена ли анимация
        if (progress >= 1.0) {
            isAnimating = false;
            currentState = targetState; // Убедимся, что точно достигли целевого состояния
        }

        return isAnimating;
    }

    public boolean isAnimating() {
        return isAnimating;
    }

    public void stopAnimation() {
        isAnimating = false;
    }

    private double applyInterpolation(double progress, String type) {
        return switch (type) {
            case "easeIn" -> easeIn(progress);
            case "easeOut" -> easeOut(progress);
            case "easeInOut" -> easeInOut(progress);
            case "bounce" -> bounce(progress);
            default -> progress;
        };
    }

    private double interpolate(double start, double end, double t) {
        return start + (end - start) * t;
    }

    private double easeIn(double t) { return t * t; }
    private double easeOut(double t) { return 1 - (1 - t) * (1 - t); }
    private double easeInOut(double t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    private double bounce(double t) {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        else if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
        else if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
        else { t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375; }
    }
}