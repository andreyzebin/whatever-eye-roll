package org.example;

import com.hubspot.jinjava.Jinjava;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class AvatarTemplateRenderer {

    private static final Jinjava jinjava = new Jinjava();
    private static final String template;

    static {
        try {
            template = Files.readString(Path.of("lib/src/main/resources/avatar.svg.j2"));
        } catch (Exception e) {
            throw new RuntimeException("Cannot load template", e);
        }
    }

    public static String render(double eyeOpen, double eyeRoll, double browAngle,
                                double browDist, double mouthCurve, double mouthOpen,
                                double pupilX, double tilt) {

        double eyeRy = 18.0 * Math.max(0.12, eyeOpen);
        double irisR = 10.0 * (0.5 + 0.5 * eyeOpen);
        double rollOffset = -eyeRoll * (eyeRy - 5.0);

        double w = 40.0;
        double topCy = 8.0 + (-mouthCurve) * 28.0;
        double bottomCy = topCy + 10.0 + mouthOpen * 26.0;

        Map<String, Object> ctx = new HashMap<>();
        ctx.put("eyeRy", fmt(eyeRy));
        ctx.put("irisR", fmt(irisR));
        ctx.put("rollOffset", fmt(rollOffset));
        ctx.put("pupilX", fmt(pupilX));
        ctx.put("browY", fmt(-48.0 + browDist));
        ctx.put("browAngle", fmt(browAngle));
        ctx.put("negBrowAngle", fmt(-browAngle));
        ctx.put("w", fmt(w));
        ctx.put("negW", fmt(-w));
        ctx.put("topCy", fmt(topCy));
        ctx.put("bottomCy", fmt(bottomCy));
        ctx.put("minTopCy16", fmt(Math.min(16.0, topCy)));
        ctx.put("tilt", fmt(tilt));

        return jinjava.render(template, ctx);
    }

    private static String fmt(double v) {
        String s = String.format(Locale.US, "%.3f", v);
        return s.replaceAll("0+$", "").replaceAll("\\.$", "");
    }

    public static void main(String[] args) throws Exception {
        Map<String, double[]> presets = Map.of(
            "avatar_eye_roll.svg", new double[]{0.9, 1.0, -20.0, -2.0, 0.0, 0.1, 0.0, 2.0},
            "avatar_happy.svg",    new double[]{1.0, 0.0,  0.0,  0.0, -0.8, 0.3, 0.0, 0.0},
            "avatar_sad.svg",      new double[]{0.7, 0.0, 10.0,  3.0,  0.8, 0.1, 0.0, 0.0},
            "avatar_angry.svg",    new double[]{0.8, 0.0, -30.0,-5.0,  0.2, 0.05,0.0, 0.0}
        );

        for (var entry : presets.entrySet()) {
            String svg = render(entry.getValue()[0], entry.getValue()[1], entry.getValue()[2],
                                entry.getValue()[3], entry.getValue()[4], entry.getValue()[5],
                                entry.getValue()[6], entry.getValue()[7]);
            Files.writeString(Path.of(entry.getKey()), svg);
            System.out.println("Rendered " + entry.getKey());
        }
    }
}
