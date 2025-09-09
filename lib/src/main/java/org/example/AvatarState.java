package org.example;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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