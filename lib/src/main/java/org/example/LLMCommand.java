package org.example;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LLMCommand {
    private long timestamp;
    private AvatarState state;
    private double duration;
    private String interpolation;
}