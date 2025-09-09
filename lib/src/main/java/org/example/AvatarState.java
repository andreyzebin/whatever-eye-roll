package org.example;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
@Introspected
public class AvatarState {
    private double eyeOpen;
    private double eyeRoll;
    private double browAngle;
    private double browDist;
    private double mouthCurve;
    private double mouthOpen;
    private double pupilX;
    private double tilt;
}