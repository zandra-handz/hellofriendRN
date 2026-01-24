export const GECKO_ONLY_TRANSPARENT_SKSL_OPT = `  
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale; 

uniform float u_gecko_scale;
uniform float u_gecko_size;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_lead_screen_space;

// uniform vec2 u_head;
// uniform vec2 u_snout;
uniform vec2 u_hint;
// uniform vec2 u_joints[15];
// uniform vec2 u_tail[13];
// uniform vec2 u_steps[4];
// uniform vec2 u_elbows[4];
// uniform vec2 u_shoulders[4];
// uniform vec2 u_muscles[8];
// uniform vec2 u_fingers[20];

// Add this single array:
uniform vec2 u_geckoPoints[71];


//  LOG  [0] u_snout
//  LOG  [1] u_head
//  LOG  [2] u_hint
//  LOG  [3] u_joints[0]
//  LOG  [4] u_joints[1]
//  LOG  [5] u_joints[2]
//  LOG  [6] u_joints[3]
//  LOG  [7] u_joints[4]
//  LOG  [8] u_joints[5]
//  LOG  [9] u_joints[6]
//  LOG  [10] u_joints[7]
//  LOG  [11] u_joints[8]
//  LOG  [12] u_joints[9]
//  LOG  [13] u_joints[10]
//  LOG  [14] u_joints[11]
//  LOG  [15] u_joints[12]
//  LOG  [16] u_joints[13]
//  LOG  [17] u_joints[14]

//  LOG  [18] u_tail[0]
//  LOG  [19] u_tail[1]
//  LOG  [20] u_tail[2]
//  LOG  [21] u_tail[3]
//  LOG  [22] u_tail[4]
//  LOG  [23] u_tail[5]
//  LOG  [24] u_tail[6]
//  LOG  [25] u_tail[7]
//  LOG  [26] u_tail[8]
//  LOG  [27] u_tail[9]
//  LOG  [28] u_tail[10]
//  LOG  [29] u_tail[11]
//  LOG  [30] u_tail[12]

//  LOG  [31] u_steps[0]
//  LOG  [32] u_steps[1]
//  LOG  [33] u_steps[2]
//  LOG  [34] u_steps[3]

//  LOG  [35] u_elbows[0]
//  LOG  [36] u_elbows[1]
//  LOG  [37] u_elbows[2]
//  LOG  [38] u_elbows[3]

//  LOG  [39] u_shoulders[0]
//  LOG  [40] u_shoulders[1]
//  LOG  [41] u_shoulders[2]
//  LOG  [42] u_shoulders[3]

//  LOG  [43] u_muscles[0]
//  LOG  [44] u_muscles[1]
//  LOG  [45] u_muscles[2]
//  LOG  [46] u_muscles[3]
//  LOG  [47] u_muscles[4]
//  LOG  [48] u_muscles[5]
//  LOG  [49] u_muscles[6]
//  LOG  [50] u_muscles[7]


//  LOG  [51] u_fingers[0]
//  LOG  [52] u_fingers[1]
//  LOG  [53] u_fingers[2]
//  LOG  [54] u_fingers[3]
//  LOG  [55] u_fingers[4]

//  LOG  [56] u_fingers[5]
//  LOG  [57] u_fingers[6]
//  LOG  [58] u_fingers[7]
//  LOG  [59] u_fingers[8]
//  LOG  [60] u_fingers[9]

//  LOG  [61] u_fingers[10]
//  LOG  [62] u_fingers[11]
//  LOG  [63] u_fingers[12]
//  LOG  [64] u_fingers[13]
//  LOG  [65] u_fingers[14]

//  LOG  [66] u_fingers[15]
//  LOG  [67] u_fingers[16]
//  LOG  [68] u_fingers[17]
//  LOG  [69] u_fingers[18]
//  LOG  [70] u_fingers[19]

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

// with finger lines
float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
    vec2 diff = uv - fingerPos;
    if (length(diff) < influence) {
        float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
        float fingerTip  = distFCircle(uv, fingerPos, radius);
        return min(fingerLine, fingerTip);
    }
    return 1.0; // large value outside influence
}

 
 

// ------------------------------------------------
// Transparent background
// ------------------------------------------------
float3 sampleBackground(float2 fragCoord) {
    return float3(0.0, 0.0, 0.0);
}

// ------------------------------------------------
// Gecko SDF Construction (all body parts included)
// ------------------------------------------------
float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;



    // Main body circles
    float circle0 = distFCircle(gecko_uv, u_geckoPoints[0], 0.003 * s / circleSizeDiv); // SNOUT
    float circle1 = distFCircle(gecko_uv, u_geckoPoints[1], 0.019 * s / circleSizeDiv); // HEAD
    float circle1b = distFCircle(gecko_uv, u_geckoPoints[4], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(gecko_uv, u_geckoPoints[5], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_geckoPoints[6], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_geckoPoints[7], 0.004 * s / circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_geckoPoints[8], 0.004 * s / circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_geckoPoints[9], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_geckoPoints[11], 0.003 * s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_geckoPoints[12], 0.003 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_geckoPoints[16], 0.002 * s / circleSizeDiv);

    float circleMerge = smoothMin(
        smoothMin(circle0, circle1, 0.03),
        smoothMin(circle1b, circle2, 0.05),
        0.005
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

    // Tail circles
    float tailCircle0 = distFCircle(gecko_uv, u_geckoPoints[18], 0.002 * s / circleSizeDiv);
    float tailCircle1 = distFCircle(gecko_uv, u_geckoPoints[19], 0.005 * s / circleSizeDiv);
    float tailCircle2 = distFCircle(gecko_uv, u_geckoPoints[20], 0.004 * s / circleSizeDiv);
    float tailCircle3 = distFCircle(gecko_uv, u_geckoPoints[21], 0.0042 * s / circleSizeDiv);
    float tailCircle4 = distFCircle(gecko_uv, u_geckoPoints[22], 0.005 * s / circleSizeDiv);
    float tailCircle5 = distFCircle(gecko_uv, u_geckoPoints[23], 0.005 * s / circleSizeDiv);
    float tailCircle6 = distFCircle(gecko_uv, u_geckoPoints[24], 0.005 * s / circleSizeDiv);
    float tailCircle7 = distFCircle(gecko_uv, u_geckoPoints[25], 0.004 * s / circleSizeDiv);
    float tailCircle8 = distFCircle(gecko_uv, u_geckoPoints[26], 0.0027 * s / circleSizeDiv);
    float tailCircle9 = distFCircle(gecko_uv, u_geckoPoints[27], 0.002 * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[28], 0.001 * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[29], 0.0001 * s / circleSizeDiv);
   // float tailCircle12 = distFCircle(gecko_uv, u_geckoPoints[30], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    float blendAmt = 0.054 * s;
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt + 0.04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
   // tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.005 * s;
    float backArmThickness = .007 * s;
    float shoulderBlend = 0.01 * s;

    float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[5], u_geckoPoints[35]); // joints[2], elbows[0]
    float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[35], u_geckoPoints[31]); // elbows[0], steps[0]
    float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[5], u_geckoPoints[36]); // joints[2], elbows[1]
    float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[36], u_geckoPoints[32]); // elbows[1], steps[1]
    float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[16], u_geckoPoints[37]); // joints[13], elbows[2]
    float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[37], u_geckoPoints[33]);// elbows[2], steps[2]
    float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[16], u_geckoPoints[38]); // joints[13], elbows[3]
    float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[38], u_geckoPoints[34]);  // elbows[3], steps[3]

    float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
    float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
    float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
    float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

    bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

    // Muscles
    float muscleBlend = 0.024 * s;
    float backMuscleBlend = .03 * s;
    float upperMuscleRadius = 0.005 * s;

    // just upper
    float musclesSDF1 = distFCircle(gecko_uv, u_geckoPoints[44], upperMuscleRadius);
    float musclesSDF3 = distFCircle(gecko_uv, u_geckoPoints[46], upperMuscleRadius);
    float musclesSDF5 = distFCircle(gecko_uv, u_geckoPoints[48], upperMuscleRadius);
    float musclesSDF7 = distFCircle(gecko_uv, u_geckoPoints[50], upperMuscleRadius);

    bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

    // Steps
    float stepBlend = 0.003 * s;
    float stepRadius = .009 * s; // prev .007

    float stepSDF0 = distFCircle(gecko_uv, u_geckoPoints[31], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_geckoPoints[32], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_geckoPoints[33], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_geckoPoints[34], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);


// ------------------------------------------------
// Optimized Fingers (inside buildGeckoSDF)
// ------------------------------------------------
float fingerThickness = 0.0025 * s;
float fingerRadius    = 0.0045 * s;
float fingerInfluence = 0.02;

// Front left fingers (0-4)
for (int i = 51; i < 56; i++) {
    float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[31], fingerThickness, fingerRadius, fingerInfluence);
    bodySDF = min(bodySDF, sdf);
}

// Front right fingers (5-9)
for (int i = 56; i < 61; i++) {
    float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[32], fingerThickness, fingerRadius, fingerInfluence);
    bodySDF = min(bodySDF, sdf);
}

// Back left fingers (10-14)
for (int i = 61; i < 66; i++) {
    float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[33], fingerThickness, fingerRadius, fingerInfluence);
    bodySDF = min(bodySDF, sdf);
}

// Back right fingers (15-19)
for (int i = 66; i < 71; i++) {
    float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[34], fingerThickness, fingerRadius, fingerInfluence);
    bodySDF = min(bodySDF, sdf);
}

    return bodySDF;
}

// ------------------------------------------------
// MAIN
// ------------------------------------------------
half4 main(float2 fragCoord) {
    float3 color = sampleBackground(fragCoord);

    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
   uv.x *= u_aspect; 
    // uv /= u_gecko_scale;
 

float s = 1.0 / u_gecko_scale;
vec2 gecko_uv = uv * s * u_gecko_size;



    vec3 leadColor = vec3(1.0, 0.0, 0.0); // red

float leadCircle = distance(gecko_uv, u_lead);
float leadMask = 1.0 - smoothstep(0.0, 0.01, leadCircle);

vec3 leadOut = leadColor * leadMask;


vec3 leadScreenColor = vec3(1.0, 0.5, 0.5); 
float leadScreenCircle = distance(gecko_uv, u_lead_screen_space);
float leadScreenMask = 1.0 - smoothstep(0.0, 0.01, leadScreenCircle);
vec3 leadScreenOut = leadScreenColor * leadScreenMask;

    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    vec3 geckoColor = endColor * geckoMask; // example green color
    color = mix(color, geckoColor, geckoMask);

    return half4(color + leadOut + leadScreenOut, geckoMask);
}
`;
