// Variant of GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX that only draws the
// step paw dots (24..27) and the finger lines/tips (36..55). Body, tail, arms,
// muscles, and eyes are commented out so only the steps + fingers render.

export const GECKO_STEPS_FINGERS_ONLY_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float u_gecko_scale;
uniform float u_gecko_size;
// uniform float u_time;
// uniform vec2 u_soul;

// COMPACT: only the points the shader actually reads (56 vec2)
uniform vec2 u_geckoPoints[56];

float TWO_PI = 6.28318530718;

// ------------------------------------------------
// SDF + glass helpers
// ------------------------------------------------
float distFCircle(vec2 uv, vec2 center, float radius) {
    return length(uv - center) - radius;
}

float smoothMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}

float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}

float sdfRect(float2 c, float2 s, float2 p, float r) {
    float2 q = abs(p - c) - s;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float heightFunc(float sd, float thickness) {
    if (sd >= 0.0) return 0.0;
    if (sd < -thickness) return thickness;
    float x = thickness + sd;
    return sqrt(max(thickness * thickness - x*x, 0.0));
}

// ------------------------------------------------
// Transparent background
// ------------------------------------------------
float3 sampleBackground(float2 fragCoord) {
    return float3(0.0, 0.0, 0.0);
}

// ------------------------------------------------
// Gecko SDF Construction (body only, no fingers)
// ------------------------------------------------
float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;

    // Main body circles
    float circle0  = distFCircle(gecko_uv, u_geckoPoints[0],  0.004 * s / circleSizeDiv);
    float circle1  = distFCircle(gecko_uv, u_geckoPoints[1],  0.028 * s / circleSizeDiv);

    float circle1b = distFCircle(gecko_uv, u_geckoPoints[2],  0.001    / circleSizeDiv);
    float circle2  = distFCircle(gecko_uv, u_geckoPoints[3],  0.00 * s / circleSizeDiv);
    float circle3  = distFCircle(gecko_uv, u_geckoPoints[4],  0.00 * s / circleSizeDiv);
    float circle4  = distFCircle(gecko_uv, u_geckoPoints[5],  0.01 * s / circleSizeDiv);
    float circle5  = distFCircle(gecko_uv, u_geckoPoints[6],  0.012 * s / circleSizeDiv);
    float circle6  = distFCircle(gecko_uv, u_geckoPoints[7],  0.012 * s / circleSizeDiv);
    float circle7  = distFCircle(gecko_uv, u_geckoPoints[8],  0.012 * s / circleSizeDiv);
    float circle8  = distFCircle(gecko_uv, u_geckoPoints[9],  0.00 * s / circleSizeDiv);
    float circle9  = distFCircle(gecko_uv, u_geckoPoints[10], 0.00 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_geckoPoints[11], 0.00 * s / circleSizeDiv);

    float circleMerge = smoothMin(
        smoothMin(circle0, circle1, 0.04),
        smoothMin(circle1b, circle2, 0.05),
        0.05
    );

    float spineBlend = .054 * s;
    circleMerge = smoothMin(circleMerge, circle3, spineBlend);
    circleMerge = smoothMin(circleMerge, circle4, spineBlend);
    circleMerge = smoothMin(circleMerge, circle5, spineBlend);
    circleMerge = smoothMin(circleMerge, circle6, spineBlend);
    circleMerge = smoothMin(circleMerge, circle7, spineBlend);
    circleMerge = smoothMin(circleMerge, circle8, spineBlend);
    circleMerge = smoothMin(circleMerge, circle9, spineBlend);
    circleMerge = smoothMin(circleMerge, circle13, spineBlend);

    // Tail circles (12..23)
    float tailCircle0  = distFCircle(gecko_uv, u_geckoPoints[12], 0.0  * s / circleSizeDiv);
    float tailCircle1  = distFCircle(gecko_uv, u_geckoPoints[13], 0.01  * s / circleSizeDiv);
    float tailCircle2  = distFCircle(gecko_uv, u_geckoPoints[14], 0.01 * s / circleSizeDiv);
    float tailCircle3  = distFCircle(gecko_uv, u_geckoPoints[15], 0.01 * s / circleSizeDiv);
    float tailCircle4  = distFCircle(gecko_uv, u_geckoPoints[16], 0.01  * s / circleSizeDiv);
    float tailCircle5  = distFCircle(gecko_uv, u_geckoPoints[17], 0.01  * s / circleSizeDiv);
    float tailCircle6  = distFCircle(gecko_uv, u_geckoPoints[18], 0.005  * s / circleSizeDiv);
    float tailCircle7  = distFCircle(gecko_uv, u_geckoPoints[19], 0.005  * s / circleSizeDiv);
    float tailCircle8  = distFCircle(gecko_uv, u_geckoPoints[20], 0.0037 * s / circleSizeDiv);
    float tailCircle9  = distFCircle(gecko_uv, u_geckoPoints[21], 0.002  * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[22], 0.001  * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[23], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.05),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    float blendAmt = 0.054 * s;
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4,  blendAmt + 0.04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.0064 * s;
    float backArmThickness = .007 * s;
    float shoulderBlend = 0.01 * s;

    float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[28]);
    float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[28], u_geckoPoints[24]);
    float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[29]);
    float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[29], u_geckoPoints[25]);
    float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[30]);
    float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[30], u_geckoPoints[26]);
    float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[31]);
    float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[31], u_geckoPoints[27]);

    float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
    float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
    float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
    float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

    bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

    // Muscles (32..35)
    float muscleBlend = 0.024 * s;
    float backMuscleBlend = .03 * s;
    float upperMuscleRadius = 0.005 * s;

    float musclesSDF1 = distFCircle(gecko_uv, u_geckoPoints[32], upperMuscleRadius);
    float musclesSDF3 = distFCircle(gecko_uv, u_geckoPoints[33], upperMuscleRadius);
    float musclesSDF5 = distFCircle(gecko_uv, u_geckoPoints[34], upperMuscleRadius);
    float musclesSDF7 = distFCircle(gecko_uv, u_geckoPoints[35], upperMuscleRadius);

    bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

    // Steps (24..27)
    float stepBlend = 0.003 * s;
    float stepRadius = .009 * s;

    float stepSDF0 = distFCircle(gecko_uv, u_geckoPoints[24], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_geckoPoints[25], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_geckoPoints[26], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_geckoPoints[27], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

    return bodySDF;
}

// ------------------------------------------------
// Finger mask (cheap lines + dots, no SDF)
// ------------------------------------------------
float buildFingerMask(vec2 gecko_uv, float s) {
    float fingerMask = 0.0;
    float fThick = 0.0025 * s;
    float fRadius2 = (0.0045 * s) * (0.0045 * s);

    vec2 stepFL = u_geckoPoints[24];
    vec2 stepFR = u_geckoPoints[25];
    vec2 stepBL = u_geckoPoints[26];
    vec2 stepBR = u_geckoPoints[27];

    // Front Left fingers (36-40)
    for (int i = 36; i < 41; i++) {
        float line = lineSegmentSDF(gecko_uv, u_geckoPoints[i], stepFL);
        fingerMask = max(fingerMask, step(line, fThick));
        vec2 d = gecko_uv - u_geckoPoints[i];
        fingerMask = max(fingerMask, step(dot(d, d), fRadius2));
    }

    // Front Right fingers (41-45)
    for (int i = 41; i < 46; i++) {
        float line = lineSegmentSDF(gecko_uv, u_geckoPoints[i], stepFR);
        fingerMask = max(fingerMask, step(line, fThick));
        vec2 d = gecko_uv - u_geckoPoints[i];
        fingerMask = max(fingerMask, step(dot(d, d), fRadius2));
    }

    // Back Left fingers (46-50)
    for (int i = 46; i < 51; i++) {
        float line = lineSegmentSDF(gecko_uv, u_geckoPoints[i], stepBL);
        fingerMask = max(fingerMask, step(line, fThick));
        vec2 d = gecko_uv - u_geckoPoints[i];
        fingerMask = max(fingerMask, step(dot(d, d), fRadius2));
    }

    // Back Right fingers (51-55)
    for (int i = 51; i < 56; i++) {
        float line = lineSegmentSDF(gecko_uv, u_geckoPoints[i], stepBR);
        fingerMask = max(fingerMask, step(line, fThick));
        vec2 d = gecko_uv - u_geckoPoints[i];
        fingerMask = max(fingerMask, step(dot(d, d), fRadius2));
    }

    return fingerMask;
}

// ------------------------------------------------
// MAIN
// ------------------------------------------------
half4 main(float2 fragCoord) {
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

    // ------------------------------------------------
    // Early exit: skip pixels outside bounding box
    // ------------------------------------------------
    vec2 boxCenter = u_geckoPoints[10];
    float halfW = 0.25 * s;
    float halfH = 0.25 * s;
    float boxSDF = max(abs(gecko_uv.x - boxCenter.x) - halfW, abs(gecko_uv.y - boxCenter.y) - halfH);

    if (boxSDF > 0.0) {
        return half4(0.0, 0.0, 0.0, 0.0);
    }

    // Everything below only runs for pixels INSIDE the box
    float3 color = sampleBackground(fragCoord);

    // Body SDF (steps-only — body/tail/arms/muscles commented out inside buildGeckoSDF)
    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);

    // Finger mask (cheap)
    float fingerMask = buildFingerMask(gecko_uv, s);

    // Combine
    float totalMask = max(geckoMask, fingerMask);
    vec3 geckoColor = endColor * totalMask;
    color = mix(color, geckoColor, totalMask);

    // Eyes: midpoint between points[0] and [1], offset perpendicular by [1]'s radius
    vec2 headDir = u_geckoPoints[1] - u_geckoPoints[0];
    vec2 headPerp = vec2(-headDir.y, headDir.x) * inversesqrt(max(dot(headDir, headDir), 1e-8));
    vec2 headMid = mix(u_geckoPoints[0], u_geckoPoints[1], 0.7);
    float eyeOffset = 0.015 * s / 0.8;
    float eyeRadius = 0.017 * s;
    vec2 d = gecko_uv - headMid;
    vec2 closerEye = headMid + headPerp * (dot(d, headPerp) >= 0.0 ? eyeOffset : -eyeOffset);
    float eyeSDF = length(gecko_uv - closerEye) - eyeRadius;
    float eyeMask = smoothstep(0.0, 0.001, -eyeSDF);
    color = mix(color, endColor, eyeMask);
    totalMask = max(totalMask, eyeMask);

    return half4(color, totalMask);
}
 `;
