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

@Slf4j
@Singleton
@ServerWebSocket("/avatar-stream")
@RequiredArgsConstructor
public class AvatarWebSocketServer {

    private final Map<String, AvatarAnimationPlayer> players = new ConcurrentHashMap<>();
    
    @OnOpen
    public void onOpen(WebSocketSession session) {
        AvatarAnimationPlayer player = new AvatarAnimationPlayer();
        players.put(session.getId(), player);
        log.info("Client connected: {}", session.getId());
    }
    
    @OnMessage
    public void onMessage(LLMCommand command, WebSocketSession session) {
        try {
            AvatarAnimationPlayer player = players.get(session.getId());
            if (player != null) {
                player.addTargetState(command);
                String svg = player.getCurrentSvg();
                session.sendSync(svg);
            }
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }
    
    @OnClose
    public void onClose(WebSocketSession session) {
        players.remove(session.getId());
        log.info("Client disconnected: {}", session.getId());
    }
}