// // export const GECKO_ONLY_TRANSPARENT_SKSL_OPT = `  
// // uniform float2 u_resolution;
// // uniform float  u_aspect;
// // uniform float  u_scale; 

// // uniform float u_gecko_scale;
// // uniform float u_gecko_size;
// // uniform float u_time;
// // uniform vec2 u_soul;
// // uniform vec2 u_lead;
// // uniform vec2 u_lead_screen_space;

// // // uniform vec2 u_head;
// // // uniform vec2 u_snout;
// // uniform vec2 u_hint;
// // // uniform vec2 u_joints[15];
// // // uniform vec2 u_tail[13];
// // // uniform vec2 u_steps[4];
// // // uniform vec2 u_elbows[4];
// // // uniform vec2 u_shoulders[4];
// // // uniform vec2 u_muscles[8];
// // // uniform vec2 u_fingers[20];

// // // Add this single array:
// // uniform vec2 u_geckoPoints[71];


// // //  LOG  [0] u_snout
// // //  LOG  [1] u_head
// // //  LOG  [2] u_hint
// // //  LOG  [3] u_joints[0]
// // //  LOG  [4] u_joints[1]
// // //  LOG  [5] u_joints[2]
// // //  LOG  [6] u_joints[3]
// // //  LOG  [7] u_joints[4]
// // //  LOG  [8] u_joints[5]
// // //  LOG  [9] u_joints[6]
// // //  LOG  [10] u_joints[7]
// // //  LOG  [11] u_joints[8]
// // //  LOG  [12] u_joints[9]
// // //  LOG  [13] u_joints[10]
// // //  LOG  [14] u_joints[11]
// // //  LOG  [15] u_joints[12]
// // //  LOG  [16] u_joints[13]
// // //  LOG  [17] u_joints[14]

// // //  LOG  [18] u_tail[0]
// // //  LOG  [19] u_tail[1]
// // //  LOG  [20] u_tail[2]
// // //  LOG  [21] u_tail[3]
// // //  LOG  [22] u_tail[4]
// // //  LOG  [23] u_tail[5]
// // //  LOG  [24] u_tail[6]
// // //  LOG  [25] u_tail[7]
// // //  LOG  [26] u_tail[8]
// // //  LOG  [27] u_tail[9]
// // //  LOG  [28] u_tail[10]
// // //  LOG  [29] u_tail[11]
// // //  LOG  [30] u_tail[12]

// // //  LOG  [31] u_steps[0]
// // //  LOG  [32] u_steps[1]
// // //  LOG  [33] u_steps[2]
// // //  LOG  [34] u_steps[3]

// // //  LOG  [35] u_elbows[0]
// // //  LOG  [36] u_elbows[1]
// // //  LOG  [37] u_elbows[2]
// // //  LOG  [38] u_elbows[3]

// // //  LOG  [39] u_shoulders[0]
// // //  LOG  [40] u_shoulders[1]
// // //  LOG  [41] u_shoulders[2]
// // //  LOG  [42] u_shoulders[3]

// // //  LOG  [43] u_muscles[0]
// // //  LOG  [44] u_muscles[1]
// // //  LOG  [45] u_muscles[2]
// // //  LOG  [46] u_muscles[3]
// // //  LOG  [47] u_muscles[4]
// // //  LOG  [48] u_muscles[5]
// // //  LOG  [49] u_muscles[6]
// // //  LOG  [50] u_muscles[7]


// // //  LOG  [51] u_fingers[0]
// // //  LOG  [52] u_fingers[1]
// // //  LOG  [53] u_fingers[2]
// // //  LOG  [54] u_fingers[3]
// // //  LOG  [55] u_fingers[4]

// // //  LOG  [56] u_fingers[5]
// // //  LOG  [57] u_fingers[6]
// // //  LOG  [58] u_fingers[7]
// // //  LOG  [59] u_fingers[8]
// // //  LOG  [60] u_fingers[9]

// // //  LOG  [61] u_fingers[10]
// // //  LOG  [62] u_fingers[11]
// // //  LOG  [63] u_fingers[12]
// // //  LOG  [64] u_fingers[13]
// // //  LOG  [65] u_fingers[14]

// // //  LOG  [66] u_fingers[15]
// // //  LOG  [67] u_fingers[16]
// // //  LOG  [68] u_fingers[17]
// // //  LOG  [69] u_fingers[18]
// // //  LOG  [70] u_fingers[19]

// // float TWO_PI = 6.28318530718;




// // // ------------------------------------------------
// // // SDF + glass helpers
// // // ------------------------------------------------
// // float distFCircle(vec2 uv, vec2 center, float radius) {
// //     return length(uv - center) - radius;
// // }

// // float smoothMin(float a, float b, float k) {
// //     float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
// //     return mix(b, a, h) - k*h*(1.0 - h);
// // }

// // float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
// //     vec2 pa = p - a;
// //     vec2 ba = b - a;
// //     float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
// //     return length(pa - ba*h);
// // }

// // float sdfRect(float2 c, float2 s, float2 p, float r) {
// //     float2 q = abs(p - c) - s;
// //     return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
// // }

// // float heightFunc(float sd, float thickness) {
// //     if (sd >= 0.0) return 0.0;
// //     if (sd < -thickness) return thickness;
// //     float x = thickness + sd;
// //     return sqrt(max(thickness * thickness - x*x, 0.0));
// // }

// // // with finger lines
// // float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
// //     vec2 diff = uv - fingerPos;
// //     if (length(diff) < influence) {
// //         float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
// //         float fingerTip  = distFCircle(uv, fingerPos, radius);
// //         return min(fingerLine, fingerTip);
// //     }
// //     return 1.0; // large value outside influence
// // }

 
 

// // // ------------------------------------------------
// // // Transparent background
// // // ------------------------------------------------
// // float3 sampleBackground(float2 fragCoord) {
// //     return float3(0.0, 0.0, 0.0);
// // }

// // // ------------------------------------------------
// // // Gecko SDF Construction (all body parts included)
// // // ------------------------------------------------
// // float buildGeckoSDF(vec2 gecko_uv, float s) {
// //     float circleSizeDiv = .8;



// //     // Main body circles
// //     float circle0 = distFCircle(gecko_uv, u_geckoPoints[0], 0.003 * s / circleSizeDiv); // SNOUT
// //     float circle1 = distFCircle(gecko_uv, u_geckoPoints[1], 0.019 * s / circleSizeDiv); // HEAD
// //     float circle1b = distFCircle(gecko_uv, u_geckoPoints[4], 0.0 / circleSizeDiv);
// //     float circle2 = distFCircle(gecko_uv, u_geckoPoints[5], 0.001 * s / circleSizeDiv);
// //     float circle3 = distFCircle(gecko_uv, u_geckoPoints[6], 0.004 * s / circleSizeDiv);
// //     float circle4 = distFCircle(gecko_uv, u_geckoPoints[7], 0.004 * s / circleSizeDiv);
// //     float circle5 = distFCircle(gecko_uv, u_geckoPoints[8], 0.004 * s / circleSizeDiv);
// //     float circle6 = distFCircle(gecko_uv, u_geckoPoints[9], 0.004 * s / circleSizeDiv);
// //     float circle7 = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv);
// //     float circle8 = distFCircle(gecko_uv, u_geckoPoints[11], 0.003 * s / circleSizeDiv);
// //     float circle9 = distFCircle(gecko_uv, u_geckoPoints[12], 0.003 * s / circleSizeDiv);
// //     float circle13 = distFCircle(gecko_uv, u_geckoPoints[16], 0.002 * s / circleSizeDiv);

// //     float circleMerge = smoothMin(
// //         smoothMin(circle0, circle1, 0.03),
// //         smoothMin(circle1b, circle2, 0.05),
// //         0.005
// //     );

// //     float spineBlend = .054 * s;
// //     circleMerge = smoothMin(circleMerge, circle3, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle4, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle5, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle6, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle7, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle8, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle9, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle13, spineBlend);

// //     // Tail circles
// //     float tailCircle0 = distFCircle(gecko_uv, u_geckoPoints[18], 0.002 * s / circleSizeDiv);
// //     float tailCircle1 = distFCircle(gecko_uv, u_geckoPoints[19], 0.005 * s / circleSizeDiv);
// //     float tailCircle2 = distFCircle(gecko_uv, u_geckoPoints[20], 0.004 * s / circleSizeDiv);
// //     float tailCircle3 = distFCircle(gecko_uv, u_geckoPoints[21], 0.0042 * s / circleSizeDiv);
// //     float tailCircle4 = distFCircle(gecko_uv, u_geckoPoints[22], 0.005 * s / circleSizeDiv);
// //     float tailCircle5 = distFCircle(gecko_uv, u_geckoPoints[23], 0.005 * s / circleSizeDiv);
// //     float tailCircle6 = distFCircle(gecko_uv, u_geckoPoints[24], 0.005 * s / circleSizeDiv);
// //     float tailCircle7 = distFCircle(gecko_uv, u_geckoPoints[25], 0.004 * s / circleSizeDiv);
// //     float tailCircle8 = distFCircle(gecko_uv, u_geckoPoints[26], 0.0027 * s / circleSizeDiv);
// //     float tailCircle9 = distFCircle(gecko_uv, u_geckoPoints[27], 0.002 * s / circleSizeDiv);
// //     float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[28], 0.001 * s / circleSizeDiv);
// //     float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[29], 0.0001 * s / circleSizeDiv);
// //    // float tailCircle12 = distFCircle(gecko_uv, u_geckoPoints[30], 0.0001 * s / circleSizeDiv);

// //     float tailCircleMerge = smoothMin(
// //         smoothMin(tailCircle0, tailCircle1, 0.03),
// //         smoothMin(tailCircle2, tailCircle3, 0.05),
// //         0.005
// //     );

// //     float blendAmt = 0.054 * s;
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt + 0.04);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
// //    // tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);

// //     float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

// //     // Arms
// //     float armThickness = 0.005 * s;
// //     float backArmThickness = .007 * s;
// //     float shoulderBlend = 0.01 * s;

// //     float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[5], u_geckoPoints[35]); // joints[2], elbows[0]
// //     float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[35], u_geckoPoints[31]); // elbows[0], steps[0]
// //     float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[5], u_geckoPoints[36]); // joints[2], elbows[1]
// //     float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[36], u_geckoPoints[32]); // elbows[1], steps[1]
// //     float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[16], u_geckoPoints[37]); // joints[13], elbows[2]
// //     float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[37], u_geckoPoints[33]);// elbows[2], steps[2]
// //     float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[16], u_geckoPoints[38]); // joints[13], elbows[3]
// //     float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[38], u_geckoPoints[34]);  // elbows[3], steps[3]

// //     float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
// //     float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
// //     float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
// //     float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

// //     bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

// //     // Muscles
// //     float muscleBlend = 0.024 * s;
// //     float backMuscleBlend = .03 * s;
// //     float upperMuscleRadius = 0.005 * s;

// //     // just upper
// //     float musclesSDF1 = distFCircle(gecko_uv, u_geckoPoints[44], upperMuscleRadius);
// //     float musclesSDF3 = distFCircle(gecko_uv, u_geckoPoints[46], upperMuscleRadius);
// //     float musclesSDF5 = distFCircle(gecko_uv, u_geckoPoints[48], upperMuscleRadius);
// //     float musclesSDF7 = distFCircle(gecko_uv, u_geckoPoints[50], upperMuscleRadius);

// //     bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

// //     // Steps
// //     float stepBlend = 0.003 * s;
// //     float stepRadius = .009 * s; // prev .007

// //     float stepSDF0 = distFCircle(gecko_uv, u_geckoPoints[31], stepRadius);
// //     float stepSDF1 = distFCircle(gecko_uv, u_geckoPoints[32], stepRadius);
// //     float stepSDF2 = distFCircle(gecko_uv, u_geckoPoints[33], stepRadius);
// //     float stepSDF3 = distFCircle(gecko_uv, u_geckoPoints[34], stepRadius);

// //     bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);


// // // ------------------------------------------------
// // // Optimized Fingers (inside buildGeckoSDF)
// // // ------------------------------------------------
// // float fingerThickness = 0.0025 * s;
// // float fingerRadius    = 0.0045 * s;
// // float fingerInfluence = 0.02;

// // // Front left fingers (0-4)
// // for (int i = 51; i < 56; i++) {
// //     float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[31], fingerThickness, fingerRadius, fingerInfluence);
// //     bodySDF = min(bodySDF, sdf);
// // }

// // // Front right fingers (5-9)
// // for (int i = 56; i < 61; i++) {
// //     float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[32], fingerThickness, fingerRadius, fingerInfluence);
// //     bodySDF = min(bodySDF, sdf);
// // }

// // // Back left fingers (10-14)
// // for (int i = 61; i < 66; i++) {
// //     float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[33], fingerThickness, fingerRadius, fingerInfluence);
// //     bodySDF = min(bodySDF, sdf);
// // }

// // // Back right fingers (15-19)
// // for (int i = 66; i < 71; i++) {
// //     float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[34], fingerThickness, fingerRadius, fingerInfluence);
// //     bodySDF = min(bodySDF, sdf);
// // }

// //     return bodySDF;
// // }

// // // ------------------------------------------------
// // // MAIN
// // // ------------------------------------------------
// // half4 main(float2 fragCoord) {
// //     float3 color = sampleBackground(fragCoord);

// //     vec2 uv = fragCoord / u_resolution;
// //     uv -= 0.5;
// //    uv.x *= u_aspect; 
// //     // uv /= u_gecko_scale;
 

// // float s = 1.0 / u_gecko_scale;
// // vec2 gecko_uv = uv * s * u_gecko_size;



// //     vec3 leadColor = vec3(1.0, 0.0, 0.0); // red

// // float leadCircle = distance(gecko_uv, u_lead);
// // float leadMask = 1.0 - smoothstep(0.0, 0.01, leadCircle);

// // vec3 leadOut = leadColor * leadMask;


// // vec3 leadScreenColor = vec3(1.0, 0.5, 0.5); 
// // float leadScreenCircle = distance(gecko_uv, u_lead_screen_space);
// // float leadScreenMask = 1.0 - smoothstep(0.0, 0.01, leadScreenCircle);
// // vec3 leadScreenOut = leadScreenColor * leadScreenMask;

// //     float geckoSDF = buildGeckoSDF(gecko_uv, s);
// //     float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
// //     vec3 geckoColor = endColor * geckoMask; // example green color
// //     color = mix(color, geckoColor, geckoMask);

// //     return half4(color + leadOut + leadScreenOut, geckoMask);
// // }
// // `;


// // export const GECKO_ONLY_TRANSPARENT_SKSL_OPT = `  
// // uniform float2 u_resolution;
// // uniform float  u_aspect;
// // uniform float  u_scale; 

// // uniform float u_gecko_scale;
// // uniform float u_gecko_size;
// // uniform float u_time;
// // // uniform vec2 u_soul;
// // // uniform vec2 u_lead;
// // // uniform vec2 u_lead_screen_space;
// // uniform vec2 u_hint;

// // // COMPACT: only 40 vec2 (was 71)
// // uniform vec2 u_geckoPoints[40];

// // // ============================================================
// // // INDEX REMAP (compact u_geckoPoints[40])
// // //
// // // Body(12):        indices 0-11
// // // Tail(12):        indices 12-23
// // // Steps(4):        indices 24-27
// // // Elbows(4):       indices 28-31
// // // Muscles(4):      indices 32-35
// // // FirstFingers(4): indices 36-39
// // // ============================================================

// // float TWO_PI = 6.28318530718;

// // // ------------------------------------------------
// // // SDF + glass helpers
// // // ------------------------------------------------
// // float distFCircle(vec2 uv, vec2 center, float radius) {
// //     return length(uv - center) - radius;
// // }

// // float smoothMin(float a, float b, float k) {
// //     float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
// //     return mix(b, a, h) - k*h*(1.0 - h);
// // }

// // float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
// //     vec2 pa = p - a;
// //     vec2 ba = b - a;
// //     float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
// //     return length(pa - ba*h);
// // }

// // float sdfRect(float2 c, float2 s, float2 p, float r) {
// //     float2 q = abs(p - c) - s;
// //     return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
// // }

// // float heightFunc(float sd, float thickness) {
// //     if (sd >= 0.0) return 0.0;
// //     if (sd < -thickness) return thickness;
// //     float x = thickness + sd;
// //     return sqrt(max(thickness * thickness - x*x, 0.0));
// // }

// // float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
// //     vec2 diff = uv - fingerPos;
// //     if (length(diff) < influence) {
// //         float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
// //         float fingerTip  = distFCircle(uv, fingerPos, radius);
// //         return min(fingerLine, fingerTip);
// //     }
// //     return 1.0;
// // }

// // // ------------------------------------------------
// // // Finger calculation function (derives angle from first finger)
// // // ------------------------------------------------
// // vec2 calculateFinger(vec2 stepTarget, vec2 firstFinger, int fingerIndex) {
// //     const int numFingers = 5;
// //     const float fingerLen = 0.024;
    
// //     // Calculate the base angle from the first finger's position
// //     vec2 diff = firstFinger - stepTarget;
// //     float baseAngle = atan(diff.y, diff.x);
    
// //     // Calculate the angular span for all 5 fingers
// //     float gapAngle = (2.0 * 3.14159265) / 1.7;
// //     float fanAngle = 2.0 * 3.14159265 - gapAngle;
    
// //     // The first finger is at one edge of the fan
// //     float t = float(fingerIndex) / float(numFingers - 1);
// //     float angleOffset = t * fanAngle;
    
// //     float angle = baseAngle + angleOffset;
    
// //     vec2 fingerPos;
// //     fingerPos.x = stepTarget.x + cos(angle) * fingerLen;
// //     fingerPos.y = stepTarget.y + sin(angle) * fingerLen;
    
// //     return fingerPos;
// // }

// // // ------------------------------------------------
// // // Transparent background
// // // ------------------------------------------------
// // float3 sampleBackground(float2 fragCoord) {
// //     return float3(0.0, 0.0, 0.0);
// // }

// // // ------------------------------------------------
// // // Gecko SDF Construction (all body parts included)
// // // ------------------------------------------------
// // float buildGeckoSDF(vec2 gecko_uv, float s) {
// //     float circleSizeDiv = .8;

// //     // Main body circles (0-11)
// //     float circle0  = distFCircle(gecko_uv, u_geckoPoints[0],  0.003 * s / circleSizeDiv); // SNOUT
// //     float circle1  = distFCircle(gecko_uv, u_geckoPoints[1],  0.019 * s / circleSizeDiv); // HEAD
// //     float circle1b = distFCircle(gecko_uv, u_geckoPoints[2],  0.0   / circleSizeDiv);
// //     float circle2  = distFCircle(gecko_uv, u_geckoPoints[3],  0.001 * s / circleSizeDiv);
// //     float circle3  = distFCircle(gecko_uv, u_geckoPoints[4],  0.004 * s / circleSizeDiv);
// //     float circle4  = distFCircle(gecko_uv, u_geckoPoints[5],  0.004 * s / circleSizeDiv);
// //     float circle5  = distFCircle(gecko_uv, u_geckoPoints[6],  0.004 * s / circleSizeDiv);
// //     float circle6  = distFCircle(gecko_uv, u_geckoPoints[7],  0.004 * s / circleSizeDiv);
// //     float circle7  = distFCircle(gecko_uv, u_geckoPoints[8],  0.003 * s / circleSizeDiv);
// //     float circle8  = distFCircle(gecko_uv, u_geckoPoints[9],  0.003 * s / circleSizeDiv);
// //     float circle9  = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv);
// //     float circle13 = distFCircle(gecko_uv, u_geckoPoints[11], 0.002 * s / circleSizeDiv);

// //     float circleMerge = smoothMin(
// //         smoothMin(circle0, circle1, 0.03),
// //         smoothMin(circle1b, circle2, 0.05),
// //         0.005
// //     );

// //     float spineBlend = .054 * s;
// //     circleMerge = smoothMin(circleMerge, circle3, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle4, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle5, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle6, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle7, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle8, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle9, spineBlend);
// //     circleMerge = smoothMin(circleMerge, circle13, spineBlend);

// //     // Tail circles (12-23)
// //     float tailCircle0  = distFCircle(gecko_uv, u_geckoPoints[12], 0.002  * s / circleSizeDiv);
// //     float tailCircle1  = distFCircle(gecko_uv, u_geckoPoints[13], 0.005  * s / circleSizeDiv);
// //     float tailCircle2  = distFCircle(gecko_uv, u_geckoPoints[14], 0.004  * s / circleSizeDiv);
// //     float tailCircle3  = distFCircle(gecko_uv, u_geckoPoints[15], 0.0042 * s / circleSizeDiv);
// //     float tailCircle4  = distFCircle(gecko_uv, u_geckoPoints[16], 0.005  * s / circleSizeDiv);
// //     float tailCircle5  = distFCircle(gecko_uv, u_geckoPoints[17], 0.005  * s / circleSizeDiv);
// //     float tailCircle6  = distFCircle(gecko_uv, u_geckoPoints[18], 0.005  * s / circleSizeDiv);
// //     float tailCircle7  = distFCircle(gecko_uv, u_geckoPoints[19], 0.004  * s / circleSizeDiv);
// //     float tailCircle8  = distFCircle(gecko_uv, u_geckoPoints[20], 0.0027 * s / circleSizeDiv);
// //     float tailCircle9  = distFCircle(gecko_uv, u_geckoPoints[21], 0.002  * s / circleSizeDiv);
// //     float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[22], 0.001  * s / circleSizeDiv);
// //     float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[23], 0.0001 * s / circleSizeDiv);

// //     float tailCircleMerge = smoothMin(
// //         smoothMin(tailCircle0, tailCircle1, 0.03),
// //         smoothMin(tailCircle2, tailCircle3, 0.05),
// //         0.005
// //     );

// //     float blendAmt = 0.054 * s;
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4,  blendAmt + 0.04);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5,  blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6,  blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7,  blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8,  blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9,  blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
// //     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);

// //     float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

// //     // Arms (steps at 24-27, elbows at 28-31)
// //     float armThickness = 0.005 * s;
// //     float backArmThickness = .007 * s;
// //     float shoulderBlend = 0.01 * s;

// //     float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[28]);
// //     float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[28], u_geckoPoints[24]);
// //     float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[29]);
// //     float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[29], u_geckoPoints[25]);
// //     float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[30]);
// //     float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[30], u_geckoPoints[26]);
// //     float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[31]);
// //     float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[31], u_geckoPoints[27]);

// //     float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
// //     float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
// //     float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
// //     float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

// //     bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
// //     bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

// //     // Muscles (32-35)
// //     float muscleBlend = 0.024 * s;
// //     float backMuscleBlend = .03 * s;
// //     float upperMuscleRadius = 0.005 * s;

// //     float musclesSDF1 = distFCircle(gecko_uv, u_geckoPoints[32], upperMuscleRadius);
// //     float musclesSDF3 = distFCircle(gecko_uv, u_geckoPoints[33], upperMuscleRadius);
// //     float musclesSDF5 = distFCircle(gecko_uv, u_geckoPoints[34], upperMuscleRadius);
// //     float musclesSDF7 = distFCircle(gecko_uv, u_geckoPoints[35], upperMuscleRadius);

// //     bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
// //     bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

// //     // Steps (24-27)
// //     float stepBlend = 0.003 * s;
// //     float stepRadius = .009 * s;

// //     float stepSDF0 = distFCircle(gecko_uv, u_geckoPoints[24], stepRadius);
// //     float stepSDF1 = distFCircle(gecko_uv, u_geckoPoints[25], stepRadius);
// //     float stepSDF2 = distFCircle(gecko_uv, u_geckoPoints[26], stepRadius);
// //     float stepSDF3 = distFCircle(gecko_uv, u_geckoPoints[27], stepRadius);

// //     bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
// //     bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

// //     // ------------------------------------------------
// //     // ✅ OPTIMIZED: Pre-calculate all finger positions ONCE
// //     // ------------------------------------------------
// //     vec2 stepFL = u_geckoPoints[24];
// //     vec2 stepFR = u_geckoPoints[25];
// //     vec2 stepBL = u_geckoPoints[26];
// //     vec2 stepBR = u_geckoPoints[27];
    
// //     vec2 firstFingerFL = u_geckoPoints[36];
// //     vec2 firstFingerFR = u_geckoPoints[37];
// //     vec2 firstFingerBL = u_geckoPoints[38];
// //     vec2 firstFingerBR = u_geckoPoints[39];
    
// //     // Pre-calculate all 20 finger positions (done ONCE, not per-pixel!)
// //     vec2 fingersFL[5];
// //     vec2 fingersFR[5];
// //     vec2 fingersBL[5];
// //     vec2 fingersBR[5];
    
// //     for (int i = 0; i < 5; i++) {
// //         fingersFL[i] = calculateFinger(stepFL, firstFingerFL, i);
// //         fingersFR[i] = calculateFinger(stepFR, firstFingerFR, i);
// //         fingersBL[i] = calculateFinger(stepBL, firstFingerBL, i);
// //         fingersBR[i] = calculateFinger(stepBR, firstFingerBR, i);
// //     }
    
// //     // Now use pre-calculated positions for SDF
// //     float fingerThickness = 0.0025 * s;
// //     float fingerRadius    = 0.0045 * s;
// //     float fingerInfluence = 0.02;
    
// //     // Front left fingers
// //     for (int i = 0; i < 5; i++) {
// //         float sdf = fingerSDFFunc(gecko_uv, fingersFL[i], stepFL,
// //                                   fingerThickness, fingerRadius, fingerInfluence);
// //         bodySDF = min(bodySDF, sdf);
// //     }
    
// //     // Front right fingers
// //     for (int i = 0; i < 5; i++) {
// //         float sdf = fingerSDFFunc(gecko_uv, fingersFR[i], stepFR,
// //                                   fingerThickness, fingerRadius, fingerInfluence);
// //         bodySDF = min(bodySDF, sdf);
// //     }
    
// //     // Back left fingers
// //     for (int i = 0; i < 5; i++) {
// //         float sdf = fingerSDFFunc(gecko_uv, fingersBL[i], stepBL,
// //                                   fingerThickness, fingerRadius, fingerInfluence);
// //         bodySDF = min(bodySDF, sdf);
// //     }
    
// //     // Back right fingers
// //     for (int i = 0; i < 5; i++) {
// //         float sdf = fingerSDFFunc(gecko_uv, fingersBR[i], stepBR,
// //                                   fingerThickness, fingerRadius, fingerInfluence);
// //         bodySDF = min(bodySDF, sdf);
// //     }

// //     return bodySDF;
// // }

// // // ------------------------------------------------
// // // MAIN
// // // ------------------------------------------------
// // half4 main(float2 fragCoord) {
// //     float3 color = sampleBackground(fragCoord);

// //     vec2 uv = fragCoord / u_resolution;
// //     uv -= 0.5;
// //     uv.x *= u_aspect; 

// //     float s = 1.0 / u_gecko_scale;
// //     vec2 gecko_uv = uv * s * u_gecko_size;

// //     // vec3 leadColor = vec3(1.0, 0.0, 0.0); // red

// //     // float leadCircle = distance(gecko_uv, u_lead);
// //     // float leadMask = 1.0 - smoothstep(0.0, 0.01, leadCircle);

// //     vec3 hintColor = vec3(1.,0.,0.);

// //     float hintCircle = distance(gecko_uv, u_hint);
// //     float hintMask = 1. - smoothstep(.0,.01, hintCircle);

// //     vec3 hintOut = hintMask * hintColor;
    

// //     // vec3 leadOut = leadColor * leadMask;

// //     // vec3 leadScreenColor = vec3(1.0, 0.5, 0.5); 
// //     // float leadScreenCircle = distance(gecko_uv, u_lead_screen_space);
// //     // float leadScreenMask = 1.0 - smoothstep(0.0, 0.01, leadScreenCircle);
// //     // vec3 leadScreenOut = leadScreenColor * leadScreenMask;

// //     float geckoSDF = buildGeckoSDF(gecko_uv, s);
// //     float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
// //     vec3 geckoColor = endColor * geckoMask; // example green color
// //     color = mix(color, geckoColor, geckoMask);

// //     return half4(color + hintOut, geckoMask);
// // }
// // `;

















// export const GECKO_ONLY_TRANSPARENT_SKSL_OPT = `  
// uniform float2 u_resolution;
// uniform float  u_aspect;
// uniform float  u_scale; 

// uniform float u_gecko_scale;
// uniform float u_gecko_size;
// uniform float u_time;
// uniform vec2 u_hint;

// // COMPACT: only 40 vec2 (was 71)
// uniform vec2 u_geckoPoints[40];

// // ============================================================
// // INDEX REMAP (compact u_geckoPoints[40])
// //
// // Body(12):        indices 0-11
// // Tail(12):        indices 12-23
// // Steps(4):        indices 24-27
// // Elbows(4):       indices 28-31
// // Muscles(4):      indices 32-35
// // FirstFingers(4): indices 36-39
// // ============================================================

// float TWO_PI = 6.28318530718;

// // ------------------------------------------------
// // SDF + glass helpers
// // ------------------------------------------------
// float distFCircle(vec2 uv, vec2 center, float radius) {
//     return length(uv - center) - radius;
// }

// float smoothMin(float a, float b, float k) {
//     float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
//     return mix(b, a, h) - k*h*(1.0 - h);
// }

// float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
//     vec2 pa = p - a;
//     vec2 ba = b - a;
//     float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
//     return length(pa - ba*h);
// }

// float sdfRect(float2 c, float2 s, float2 p, float r) {
//     float2 q = abs(p - c) - s;
//     return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
// }

// float heightFunc(float sd, float thickness) {
//     if (sd >= 0.0) return 0.0;
//     if (sd < -thickness) return thickness;
//     float x = thickness + sd;
//     return sqrt(max(thickness * thickness - x*x, 0.0));
// }

// float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
//     vec2 diff = uv - fingerPos;
//     if (length(diff) < influence) {
//         float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
//         float fingerTip  = distFCircle(uv, fingerPos, radius);
//         return min(fingerLine, fingerTip);
//     }
//     return 1.0;
// }

// // ------------------------------------------------
// // Finger calculation function (derives angle from first finger)
// // ------------------------------------------------
// vec2 calculateFinger(vec2 stepTarget, vec2 firstFinger, int fingerIndex) {
//     const int numFingers = 5;
//     const float fingerLen = 0.024;
    
//     // Calculate the base angle from the first finger's position
//     vec2 diff = firstFinger - stepTarget;
//     float baseAngle = atan(diff.y, diff.x);
    
//     // Calculate the angular span for all 5 fingers
//     float gapAngle = (2.0 * 3.14159265) / 1.7;
//     float fanAngle = 2.0 * 3.14159265 - gapAngle;
    
//     // The first finger is at one edge of the fan
//     float t = float(fingerIndex) / float(numFingers - 1);
//     float angleOffset = t * fanAngle;
    
//     float angle = baseAngle + angleOffset;
    
//     vec2 fingerPos;
//     fingerPos.x = stepTarget.x + cos(angle) * fingerLen;
//     fingerPos.y = stepTarget.y + sin(angle) * fingerLen;
    
//     return fingerPos;
// }

// // ------------------------------------------------
// // Transparent background
// // ------------------------------------------------
// float3 sampleBackground(float2 fragCoord) {
//     return float3(0.0, 0.0, 0.0);
// }

// // ------------------------------------------------
// // Gecko SDF Construction (all body parts included)
// // ------------------------------------------------
// float buildGeckoSDF(vec2 gecko_uv, float s) {
//     float circleSizeDiv = .8;

//     // Main body circles (0-11)
//     float circle0  = distFCircle(gecko_uv, u_geckoPoints[0],  0.003 * s / circleSizeDiv); // SNOUT
//     float circle1  = distFCircle(gecko_uv, u_geckoPoints[1],  0.019 * s / circleSizeDiv); // HEAD
//     float circle1b = distFCircle(gecko_uv, u_geckoPoints[2],  0.0   / circleSizeDiv);
//     float circle2  = distFCircle(gecko_uv, u_geckoPoints[3],  0.001 * s / circleSizeDiv);
//     float circle3  = distFCircle(gecko_uv, u_geckoPoints[4],  0.004 * s / circleSizeDiv);
//     float circle4  = distFCircle(gecko_uv, u_geckoPoints[5],  0.004 * s / circleSizeDiv);
//     float circle5  = distFCircle(gecko_uv, u_geckoPoints[6],  0.004 * s / circleSizeDiv);
//     float circle6  = distFCircle(gecko_uv, u_geckoPoints[7],  0.004 * s / circleSizeDiv);
//     float circle7  = distFCircle(gecko_uv, u_geckoPoints[8],  0.003 * s / circleSizeDiv);
//     float circle8  = distFCircle(gecko_uv, u_geckoPoints[9],  0.003 * s / circleSizeDiv);
//     float circle9  = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv);
//     float circle13 = distFCircle(gecko_uv, u_geckoPoints[11], 0.002 * s / circleSizeDiv);

//     float circleMerge = smoothMin(
//         smoothMin(circle0, circle1, 0.03),
//         smoothMin(circle1b, circle2, 0.05),
//         0.005
//     );

//     float spineBlend = .054 * s;
//     circleMerge = smoothMin(circleMerge, circle3, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle4, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle5, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle6, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle7, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle8, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle9, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle13, spineBlend);

//     // Tail circles (12-23)
//     float tailCircle0  = distFCircle(gecko_uv, u_geckoPoints[12], 0.002  * s / circleSizeDiv);
//     float tailCircle1  = distFCircle(gecko_uv, u_geckoPoints[13], 0.005  * s / circleSizeDiv);
//     float tailCircle2  = distFCircle(gecko_uv, u_geckoPoints[14], 0.004  * s / circleSizeDiv);
//     float tailCircle3  = distFCircle(gecko_uv, u_geckoPoints[15], 0.0042 * s / circleSizeDiv);
//     float tailCircle4  = distFCircle(gecko_uv, u_geckoPoints[16], 0.005  * s / circleSizeDiv);
//     float tailCircle5  = distFCircle(gecko_uv, u_geckoPoints[17], 0.005  * s / circleSizeDiv);
//     float tailCircle6  = distFCircle(gecko_uv, u_geckoPoints[18], 0.005  * s / circleSizeDiv);
//     float tailCircle7  = distFCircle(gecko_uv, u_geckoPoints[19], 0.004  * s / circleSizeDiv);
//     float tailCircle8  = distFCircle(gecko_uv, u_geckoPoints[20], 0.0027 * s / circleSizeDiv);
//     float tailCircle9  = distFCircle(gecko_uv, u_geckoPoints[21], 0.002  * s / circleSizeDiv);
//     float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[22], 0.001  * s / circleSizeDiv);
//     float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[23], 0.0001 * s / circleSizeDiv);

//     float tailCircleMerge = smoothMin(
//         smoothMin(tailCircle0, tailCircle1, 0.03),
//         smoothMin(tailCircle2, tailCircle3, 0.05),
//         0.005
//     );

//     float blendAmt = 0.054 * s;
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4,  blendAmt + 0.04);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5,  blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6,  blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7,  blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8,  blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9,  blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);

//     float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

//     // Arms (steps at 24-27, elbows at 28-31)
//     float armThickness = 0.005 * s;
//     float backArmThickness = .007 * s;
//     float shoulderBlend = 0.01 * s;

//     float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[28]);
//     float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[28], u_geckoPoints[24]);
//     float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[29]);
//     float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[29], u_geckoPoints[25]);
//     float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[30]);
//     float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[30], u_geckoPoints[26]);
//     float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[31]);
//     float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[31], u_geckoPoints[27]);

//     float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
//     float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
//     float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
//     float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

//     bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

//     // Muscles (32-35)
//     float muscleBlend = 0.024 * s;
//     float backMuscleBlend = .03 * s;
//     float upperMuscleRadius = 0.005 * s;

//     float musclesSDF1 = distFCircle(gecko_uv, u_geckoPoints[32], upperMuscleRadius);
//     float musclesSDF3 = distFCircle(gecko_uv, u_geckoPoints[33], upperMuscleRadius);
//     float musclesSDF5 = distFCircle(gecko_uv, u_geckoPoints[34], upperMuscleRadius);
//     float musclesSDF7 = distFCircle(gecko_uv, u_geckoPoints[35], upperMuscleRadius);

//     bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
//     bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
//     bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
//     bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

//     // Steps (24-27)
//     float stepBlend = 0.003 * s;
//     float stepRadius = .009 * s;

//     float stepSDF0 = distFCircle(gecko_uv, u_geckoPoints[24], stepRadius);
//     float stepSDF1 = distFCircle(gecko_uv, u_geckoPoints[25], stepRadius);
//     float stepSDF2 = distFCircle(gecko_uv, u_geckoPoints[26], stepRadius);
//     float stepSDF3 = distFCircle(gecko_uv, u_geckoPoints[27], stepRadius);

//     bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

//     // ------------------------------------------------
//     // ✅ OPTIMIZED: Pre-calculate all finger positions ONCE
//     // ------------------------------------------------
//     vec2 stepFL = u_geckoPoints[24];
//     vec2 stepFR = u_geckoPoints[25];
//     vec2 stepBL = u_geckoPoints[26];
//     vec2 stepBR = u_geckoPoints[27];
    
//     vec2 firstFingerFL = u_geckoPoints[36];
//     vec2 firstFingerFR = u_geckoPoints[37];
//     vec2 firstFingerBL = u_geckoPoints[38];
//     vec2 firstFingerBR = u_geckoPoints[39];
    
//     // Pre-calculate all 20 finger positions (done ONCE, not per-pixel!)
//     vec2 fingersFL[5];
//     vec2 fingersFR[5];
//     vec2 fingersBL[5];
//     vec2 fingersBR[5];
    
//     for (int i = 0; i < 5; i++) {
//         fingersFL[i] = calculateFinger(stepFL, firstFingerFL, i);
//         fingersFR[i] = calculateFinger(stepFR, firstFingerFR, i);
//         fingersBL[i] = calculateFinger(stepBL, firstFingerBL, i);
//         fingersBR[i] = calculateFinger(stepBR, firstFingerBR, i);
//     }
    
//     // Now use pre-calculated positions for SDF
//     float fingerThickness = 0.0025 * s;
//     float fingerRadius    = 0.0045 * s;
//     float fingerInfluence = 0.02;
    
//     // Front left fingers
//     for (int i = 0; i < 5; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, fingersFL[i], stepFL,
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }
    
//     // Front right fingers
//     for (int i = 0; i < 5; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, fingersFR[i], stepFR,
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }
    
//     // Back left fingers
//     for (int i = 0; i < 5; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, fingersBL[i], stepBL,
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }
    
//     // Back right fingers
//     for (int i = 0; i < 5; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, fingersBR[i], stepBR,
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }

//     return bodySDF;
// }

// // ------------------------------------------------
// // MAIN
// // ------------------------------------------------
// half4 main(float2 fragCoord) {
//     float3 color = sampleBackground(fragCoord);

//     vec2 uv = fragCoord / u_resolution;
//     uv -= 0.5;
//     uv.x *= u_aspect; 

//     float s = 1.0 / u_gecko_scale;
//     vec2 gecko_uv = uv * s * u_gecko_size;

//     // ------------------------------------------------
//     // Pulsing Hint Animation (layered ripples)
//     // ------------------------------------------------
//     vec3 hintColor = endColor; // Soft blue
//     float hintCircle = distance(gecko_uv, u_hint);
    
//     // Pulse parameters
//     float pulseSpeed = 2.0;  // Speed of pulsing
//     float pulseAmount = 0.2; // How much it grows (0.2 = 20%)
    
//     // Outer glow (large, slow pulse)
//     float outerPulse = 1.0 + pulseAmount * sin(u_time * pulseSpeed);
//     float outerGlowSize = 0.025 * outerPulse;
//     float outerGlow = smoothstep(outerGlowSize, 0.0, hintCircle);
//     vec3 outerGlowColor = hintColor * outerGlow * 0.3;
    
//     // Middle ring (medium pulse, offset timing)
//     float middlePulse = 1.0 + pulseAmount * 0.5 * sin(u_time * pulseSpeed + 1.0);
//     float middleRingSize = 0.015 * middlePulse;
//     float middleRing = smoothstep(middleRingSize, middleRingSize * 0.7, hintCircle);
//     vec3 middleRingColor = hintColor * middleRing * 0.5;
    
//     // Core dot (small, gentle pulse)
//     float corePulse = 1.0 + pulseAmount * 0.3 * sin(u_time * pulseSpeed + 2.0);
//     float coreSize = 0.008 * corePulse;
//     float coreDot = smoothstep(coreSize, 0.0, hintCircle);
//     vec3 coreDotColor = hintColor * coreDot;
    
//     // Combine all hint layers for a nice ripple effect
//     vec3 hintOut = outerGlowColor + middleRingColor + coreDotColor;

//     // Render gecko
//     float geckoSDF = buildGeckoSDF(gecko_uv, s);
//     float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
//     vec3 geckoColor = endColor * geckoMask;
//     color = mix(color, geckoColor, geckoMask);

//     // Add hint on top
//     return half4(color + hintOut, geckoMask);
// }
// `;

export const GECKO_ONLY_TRANSPARENT_SKSL_OPT = `  
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale; 

uniform float u_gecko_scale;
uniform float u_gecko_size;
uniform float u_time;
uniform vec2 u_hint;

// COMPACT: only 40 vec2 (was 71)
// Index 0 = SNOUT, Index 1 = HEAD
uniform vec2 u_geckoPoints[40];

float TWO_PI = 6.28318530718;

// ------------------------------------------------
// SDF helpers
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

float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
    vec2 diff = uv - fingerPos;
    if (length(diff) < influence) {
        float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
        float fingerTip  = distFCircle(uv, fingerPos, radius);
        return min(fingerLine, fingerTip);
    }
    return 1.0;
}

// ------------------------------------------------
// Triangle SDF for arrow (pointing right in local space)
// ------------------------------------------------
float triangleSDF(vec2 p, float size) {
    // Triangle pointing right: (tip, bottom, top)
    vec2 p0 = vec2(size, 0.0);                    // tip (right)
    vec2 p1 = vec2(-size * 0.5, -size * 0.6);    // bottom left
    vec2 p2 = vec2(-size * 0.5, size * 0.6);     // top left
    
    vec2 e0 = p1 - p0;
    vec2 e1 = p2 - p1;
    vec2 e2 = p0 - p2;
    vec2 v0 = p - p0;
    vec2 v1 = p - p1;
    vec2 v2 = p - p2;
    
    vec2 pq0 = v0 - e0*clamp(dot(v0,e0)/dot(e0,e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1*clamp(dot(v1,e1)/dot(e1,e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2*clamp(dot(v2,e2)/dot(e2,e2), 0.0, 1.0);
    
    float s = sign(e0.x*e2.y - e0.y*e2.x);
    vec2 d = min(min(vec2(dot(pq0,pq0), s*(v0.x*e0.y-v0.y*e0.x)),
                     vec2(dot(pq1,pq1), s*(v1.x*e1.y-v1.y*e1.x))),
                     vec2(dot(pq2,pq2), s*(v2.x*e2.y-v2.y*e2.x)));
    
    return -sqrt(d.x)*sign(d.y);
}

// ------------------------------------------------
// Rotate a 2D point around origin
// ------------------------------------------------
vec2 rotate2D(vec2 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

vec2 calculateFinger(vec2 stepTarget, vec2 firstFinger, int fingerIndex) {
    const int numFingers = 5;
    const float fingerLen = 0.024;
    
    vec2 diff = firstFinger - stepTarget;
    float baseAngle = atan(diff.y, diff.x);
    
    float gapAngle = (2.0 * 3.14159265) / 1.7;
    float fanAngle = 2.0 * 3.14159265 - gapAngle;
    
    float t = float(fingerIndex) / float(numFingers - 1);
    float angleOffset = t * fanAngle;
    
    float angle = baseAngle + angleOffset;
    
    vec2 fingerPos;
    fingerPos.x = stepTarget.x + cos(angle) * fingerLen;
    fingerPos.y = stepTarget.y + sin(angle) * fingerLen;
    
    return fingerPos;
}

float3 sampleBackground(float2 fragCoord) {
    return float3(0.0, 0.0, 0.0);
}

// ------------------------------------------------
// Gecko SDF Construction
// ------------------------------------------------
float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;

    // Main body circles (0-11)
    float circle0  = distFCircle(gecko_uv, u_geckoPoints[0],  0.003 * s / circleSizeDiv);
    float circle1  = distFCircle(gecko_uv, u_geckoPoints[1],  0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_geckoPoints[2],  0.0   / circleSizeDiv);
    float circle2  = distFCircle(gecko_uv, u_geckoPoints[3],  0.001 * s / circleSizeDiv);
    float circle3  = distFCircle(gecko_uv, u_geckoPoints[4],  0.004 * s / circleSizeDiv);
    float circle4  = distFCircle(gecko_uv, u_geckoPoints[5],  0.004 * s / circleSizeDiv);
    float circle5  = distFCircle(gecko_uv, u_geckoPoints[6],  0.004 * s / circleSizeDiv);
    float circle6  = distFCircle(gecko_uv, u_geckoPoints[7],  0.004 * s / circleSizeDiv);
    float circle7  = distFCircle(gecko_uv, u_geckoPoints[8],  0.003 * s / circleSizeDiv);
    float circle8  = distFCircle(gecko_uv, u_geckoPoints[9],  0.003 * s / circleSizeDiv);
    float circle9  = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_geckoPoints[11], 0.002 * s / circleSizeDiv);

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

    // Tail circles (12-23)
    float tailCircle0  = distFCircle(gecko_uv, u_geckoPoints[12], 0.002  * s / circleSizeDiv);
    float tailCircle1  = distFCircle(gecko_uv, u_geckoPoints[13], 0.005  * s / circleSizeDiv);
    float tailCircle2  = distFCircle(gecko_uv, u_geckoPoints[14], 0.004  * s / circleSizeDiv);
    float tailCircle3  = distFCircle(gecko_uv, u_geckoPoints[15], 0.0042 * s / circleSizeDiv);
    float tailCircle4  = distFCircle(gecko_uv, u_geckoPoints[16], 0.005  * s / circleSizeDiv);
    float tailCircle5  = distFCircle(gecko_uv, u_geckoPoints[17], 0.005  * s / circleSizeDiv);
    float tailCircle6  = distFCircle(gecko_uv, u_geckoPoints[18], 0.005  * s / circleSizeDiv);
    float tailCircle7  = distFCircle(gecko_uv, u_geckoPoints[19], 0.004  * s / circleSizeDiv);
    float tailCircle8  = distFCircle(gecko_uv, u_geckoPoints[20], 0.0027 * s / circleSizeDiv);
    float tailCircle9  = distFCircle(gecko_uv, u_geckoPoints[21], 0.002  * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_geckoPoints[22], 0.001  * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_geckoPoints[23], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
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

    // Arms, muscles, steps (keeping your existing code)
    float armThickness = 0.005 * s;
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

    // Fingers (keeping your existing code)
    vec2 stepFL = u_geckoPoints[24];
    vec2 stepFR = u_geckoPoints[25];
    vec2 stepBL = u_geckoPoints[26];
    vec2 stepBR = u_geckoPoints[27];
    
    vec2 firstFingerFL = u_geckoPoints[36];
    vec2 firstFingerFR = u_geckoPoints[37];
    vec2 firstFingerBL = u_geckoPoints[38];
    vec2 firstFingerBR = u_geckoPoints[39];
    
    vec2 fingersFL[5];
    vec2 fingersFR[5];
    vec2 fingersBL[5];
    vec2 fingersBR[5];
    
    for (int i = 0; i < 5; i++) {
        fingersFL[i] = calculateFinger(stepFL, firstFingerFL, i);
        fingersFR[i] = calculateFinger(stepFR, firstFingerFR, i);
        fingersBL[i] = calculateFinger(stepBL, firstFingerBL, i);
        fingersBR[i] = calculateFinger(stepBR, firstFingerBR, i);
    }
    
    float fingerThickness = 0.0025 * s;
    float fingerRadius    = 0.0045 * s;
    float fingerInfluence = 0.02;
    
    for (int i = 0; i < 5; i++) {
        bodySDF = min(bodySDF, fingerSDFFunc(gecko_uv, fingersFL[i], stepFL, fingerThickness, fingerRadius, fingerInfluence));
        bodySDF = min(bodySDF, fingerSDFFunc(gecko_uv, fingersFR[i], stepFR, fingerThickness, fingerRadius, fingerInfluence));
        bodySDF = min(bodySDF, fingerSDFFunc(gecko_uv, fingersBL[i], stepBL, fingerThickness, fingerRadius, fingerInfluence));
        bodySDF = min(bodySDF, fingerSDFFunc(gecko_uv, fingersBR[i], stepBR, fingerThickness, fingerRadius, fingerInfluence));
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

    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

    // ------------------------------------------------
    // Hint with Directional Arrow
    // ------------------------------------------------
    vec3 hintColor = endColor;
    float hintCircle = distance(gecko_uv, u_hint);
    
    // Calculate direction: snout (index 0) points toward head (index 1)
    vec2 snout = u_geckoPoints[0];
    vec2 head = u_geckoPoints[1];
    vec2 directionVector = snout - head;  // Direction snout is facing
    float arrowAngle = atan(directionVector.y, directionVector.x);
    
    // Pulse parameters
    float pulseSpeed = 2.0;
    float pulseAmount = 0.2;
    
    // Outer glow
    float outerPulse = 1.0 + pulseAmount * sin(u_time * pulseSpeed);
    float outerGlowSize = 0.035 * outerPulse;
    float outerGlow = smoothstep(outerGlowSize, 0.0, hintCircle);
    vec3 outerGlowColor = hintColor * outerGlow * 0.3;
    
    // Middle ring
    float middlePulse = 1.0 + pulseAmount * 0.5 * sin(u_time * pulseSpeed + 1.0);
    float middleRingSize = 0.015 * middlePulse;
    float middleRing = smoothstep(middleRingSize, middleRingSize * 0.7, hintCircle);
    vec3 middleRingColor = hintColor * middleRing * 0.5;
    
    // Core dot
    float corePulse = 1.0 + pulseAmount * 0.3 * sin(u_time * pulseSpeed + 2.0);
    float coreSize = 0.008 * corePulse;
    float coreDot = smoothstep(coreSize, 0.0, hintCircle);
    vec3 coreDotColor = hintColor * coreDot;
    
    // ------------------------------------------------
    // Arrow INSIDE the hint dot (DEBUGGING - VERY VISIBLE)
    // ------------------------------------------------
    vec2 localPos = gecko_uv - u_hint;
    vec2 rotatedPos = rotate2D(localPos, -arrowAngle);
    
    // MUCH LARGER arrow
    float arrowSize = 0.018;  // Way bigger to see it
    float arrowSDF = triangleSDF(rotatedPos, arrowSize);
    
    // Simple step function - if inside triangle, full brightness
    float arrowMask = step(arrowSDF, 0.0);
    
    // BRIGHT white arrow for debugging
    vec3 arrowColor = vec3(1.0, 1.0, 1.0) * arrowMask;
       // vec3 arrowColor = endColor * arrowMask;
    
    // Combine all hint layers
    vec3 hintOut = outerGlowColor + middleRingColor + coreDotColor + arrowColor;

    // Render gecko
    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    vec3 geckoColor = endColor * geckoMask;
    color = mix(color, geckoColor, geckoMask);

    return half4(color + hintOut, geckoMask);
}
`;
