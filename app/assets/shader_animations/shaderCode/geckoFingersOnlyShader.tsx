export const GECKO_FINGERS_ONLY_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float u_gecko_scale;
uniform float u_gecko_size;

// Same compact layout as the body shader: fingers live at indices 36..55
// Step targets at 24..27
uniform vec2 u_geckoPoints[56];

// ------------------------------------------------
// Helpers
// ------------------------------------------------
float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}

// Axis-aligned bounding box SDF (>0 outside, <0 inside)
float boxSDF(vec2 p, vec2 center, float halfW, float halfH) {
    return max(abs(p.x - center.x) - halfW, abs(p.y - center.y) - halfH);
}

// ------------------------------------------------
// Per-foot finger mask (5 fingers fanned from step target)
// iStart/iEnd are inclusive start / exclusive end indices into u_geckoPoints
// ------------------------------------------------
float footFingerMask(vec2 gecko_uv, vec2 stepTarget, int iStart, int iEnd, float s) {
    float fThick = 0.0025 * s;
    float fRadius2 = (0.0045 * s) * (0.0045 * s);
    float mask = 0.0;

    for (int i = iStart; i < iEnd; i++) {
        float line = lineSegmentSDF(gecko_uv, u_geckoPoints[i], stepTarget);
        mask = max(mask, step(line, fThick));
        vec2 d = gecko_uv - u_geckoPoints[i];
        mask = max(mask, step(dot(d, d), fRadius2));
    }
    return mask;
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

    vec2 stepFL = u_geckoPoints[24];
    vec2 stepFR = u_geckoPoints[25];
    vec2 stepBL = u_geckoPoints[26];
    vec2 stepBR = u_geckoPoints[27];

    // Per-foot bounding boxes: each foot's fingers fan out from its step
    // target by ~fingerLen. Pad a little for thickness + tip radius.
    float halfW = 0.030 * s;
    float halfH = 0.030 * s;

    float boxFL = boxSDF(gecko_uv, stepFL, halfW, halfH);
    float boxFR = boxSDF(gecko_uv, stepFR, halfW, halfH);
    float boxBL = boxSDF(gecko_uv, stepBL, halfW, halfH);
    float boxBR = boxSDF(gecko_uv, stepBR, halfW, halfH);

    // Early exit: outside all four boxes
    float minBox = min(min(boxFL, boxFR), min(boxBL, boxBR));
    if (minBox > 0.0) {
        return half4(0.0, 0.0, 0.0, 0.0);
    }

    float mask = 0.0;

    if (boxFL <= 0.0) mask = max(mask, footFingerMask(gecko_uv, stepFL, 36, 41, s));
    if (boxFR <= 0.0) mask = max(mask, footFingerMask(gecko_uv, stepFR, 41, 46, s));
    if (boxBL <= 0.0) mask = max(mask, footFingerMask(gecko_uv, stepBL, 46, 51, s));
    if (boxBR <= 0.0) mask = max(mask, footFingerMask(gecko_uv, stepBR, 51, 56, s));

    vec3 fingerColor = vec3(1.0, 1.0, 1.0) * mask;
    return half4(fingerColor, mask);
}
`;
