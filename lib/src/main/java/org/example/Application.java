package org.example;

import io.micronaut.runtime.Micronaut;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;

@Singleton
public class Application {

    @Value("${micronaut.server.port:8080}")
    private int port;
    
    public static void main(String[] args) {
        Micronaut.build(args)
                .mainClass(Application.class)
                .start();
    }
}