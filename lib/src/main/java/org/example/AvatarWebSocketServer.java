package org.example;

import io.micronaut.websocket.WebSocketSession;
import io.micronaut.websocket.annotation.OnClose;
import io.micronaut.websocket.annotation.OnMessage;
import io.micronaut.websocket.annotation.OnOpen;
import io.micronaut.websocket.annotation.ServerWebSocket;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Singleton
@ServerWebSocket("/avatar-stream")
@RequiredArgsConstructor
public class AvatarWebSocketServer {

    private final Map<String, AvatarAnimationPlayer> players = new ConcurrentHashMap<>();
    private final Map<String, Boolean> animationFlags = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    @OnOpen
    public void onOpen(WebSocketSession session) {
        AvatarAnimationPlayer player = new AvatarAnimationPlayer();
        players.put(session.getId(), player);
        animationFlags.put(session.getId(), false);

        log.info("Client connected: {}", session.getId());

        // Запускаем поток отправки кадров для этого клиента
        startAnimationLoop(session.getId(), session);
    }

    @OnMessage
    public void onMessage(LLMCommand command, WebSocketSession session) {
        try {
            AvatarAnimationPlayer player = players.get(session.getId());
            if (player != null) {
                player.addTargetState(command);
                animationFlags.put(session.getId(), true);
                log.debug("Started animation for session: {}", session.getId());
            }
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }

    @OnClose
    public void onClose(WebSocketSession session) {
        String sessionId = session.getId();
        players.remove(sessionId);
        animationFlags.remove(sessionId);
        log.info("Client disconnected: {}", sessionId);
    }

    private void startAnimationLoop(String sessionId, WebSocketSession session) {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                if (!session.isOpen()) {
                    return;
                }

                AvatarAnimationPlayer player = players.get(sessionId);
                Boolean isAnimating = animationFlags.get(sessionId);

                if (player != null && isAnimating != null && isAnimating) {
                    // Обновляем состояние и получаем SVG
                    boolean stillAnimating = player.updateCurrentState();
                    String svg = player.getCurrentSvg();

                    // Отправляем кадр
                    session.sendSync(svg);

                    // Если анимация завершена, останавливаем флаг
                    if (!stillAnimating) {
                        animationFlags.put(sessionId, false);
                        log.debug("Animation completed for session: {}", sessionId);

                        // Отправляем финальный кадр для точности
                        session.sendSync(player.getCurrentSvg());
                    }
                }
            } catch (Exception e) {
                log.error("Error in animation loop for session {}: {}", sessionId, e.getMessage());
                animationFlags.put(sessionId, false);
            }
        }, 0, 33, TimeUnit.MILLISECONDS); // 30 FPS
    }
}