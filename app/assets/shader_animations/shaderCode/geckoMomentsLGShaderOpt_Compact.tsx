
//56 uniform version

// export const GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT = `  
// uniform float2 u_resolution;
// uniform float  u_aspect;
// uniform float  u_scale; 

// uniform float u_gecko_scale; 
// uniform float u_gecko_size; // overall size of gecko
// uniform float u_time;
// uniform vec2 u_soul;
// uniform vec2 u_lead; 
// uniform vec2 u_hint; 

// // COMPACT: only the points the shader actually reads (56 vec2)
// uniform vec2 u_geckoPoints[56];

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

// // with finger lines
// float fingerSDFFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius, float influence) {
//     vec2 diff = uv - fingerPos;
//     if (length(diff) < influence) {
//         float fingerLine = lineSegmentSDF(uv, fingerPos, stepPos) - thickness;
//         float fingerTip  = distFCircle(uv, fingerPos, radius);
//         return min(fingerLine, fingerTip);
//     }
//     return 1.0; // large value outside influence
// }

// float fingerDrawFunc(vec2 uv, vec2 fingerPos, vec2 stepPos, float thickness, float radius) {
//     vec2 pa = uv - fingerPos;
//     vec2 ba = stepPos - fingerPos;
//     float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
//     float distToLine = length(pa - ba * h);

//     float lineMask = step(distToLine, thickness);
//     float distToCircle = distance(uv, fingerPos);
//     float circleMask = step(distToCircle, radius);

//     return max(lineMask, circleMask);
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

//     // ============================================================
//     // INDEX REMAP (old -> new compact u_geckoPoints[56])
//     //
//     // Body used:
//     // old 0->0, 1->1, 4->2, 5->3, 6->4, 7->5, 8->6, 9->7,
//     // old 10->8, 11->9, 12->10, 16->11
//     //
//     // Tail used (old 18..29) -> new (12..23)
//     // Steps (old 31..34) -> new (24..27)
//     // Elbows (old 35..38) -> new (28..31)
//     // Muscles used (old 44,46,48,50) -> new (32..35)
//     // Fingers (old 51..70) -> new (36..55)
//     // ============================================================

//     // Main body circles
//     float circle0  = distFCircle(gecko_uv, u_geckoPoints[0],  0.003 * s / circleSizeDiv); // old 0 snout
//     float circle1  = distFCircle(gecko_uv, u_geckoPoints[1],  0.019 * s / circleSizeDiv); // old 1 head
//     float circle1b = distFCircle(gecko_uv, u_geckoPoints[2],  0.0   / circleSizeDiv);     // old 4
//     float circle2  = distFCircle(gecko_uv, u_geckoPoints[3],  0.001 * s / circleSizeDiv); // old 5
//     float circle3  = distFCircle(gecko_uv, u_geckoPoints[4],  0.004 * s / circleSizeDiv); // old 6
//     float circle4  = distFCircle(gecko_uv, u_geckoPoints[5],  0.004 * s / circleSizeDiv); // old 7
//     float circle5  = distFCircle(gecko_uv, u_geckoPoints[6],  0.004 * s / circleSizeDiv); // old 8
//     float circle6  = distFCircle(gecko_uv, u_geckoPoints[7],  0.004 * s / circleSizeDiv); // old 9
//     float circle7  = distFCircle(gecko_uv, u_geckoPoints[8],  0.003 * s / circleSizeDiv); // old 10
//     float circle8  = distFCircle(gecko_uv, u_geckoPoints[9],  0.003 * s / circleSizeDiv); // old 11
//     float circle9  = distFCircle(gecko_uv, u_geckoPoints[10], 0.003 * s / circleSizeDiv); // old 12
//     float circle13 = distFCircle(gecko_uv, u_geckoPoints[11], 0.002 * s / circleSizeDiv); // old 16

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

//     // Tail circles (old 18..29 -> new 12..23)
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

//     // Arms
//     float armThickness = 0.005 * s;
//     float backArmThickness = .007 * s;
//     float shoulderBlend = 0.01 * s;

//     // Steps new 24..27, Elbows new 28..31
//     float arm0Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[28]); // old 5 ->3, old 35 ->28
//     float arm0Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[28], u_geckoPoints[24]); // old 35 ->28, old 31 ->24

//     float arm1Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[3],  u_geckoPoints[29]); // old 36 ->29
//     float arm1Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[29], u_geckoPoints[25]); // old 32 ->25

//     float arm2Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[30]); // old 16 ->11, old 37 ->30
//     float arm2Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[30], u_geckoPoints[26]); // old 33 ->26

//     float arm3Upper = lineSegmentSDF(gecko_uv, u_geckoPoints[11], u_geckoPoints[31]); // old 38 ->31
//     float arm3Lower = lineSegmentSDF(gecko_uv, u_geckoPoints[31], u_geckoPoints[27]); // old 34 ->27

//     float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
//     float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
//     float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
//     float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

//     bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

//     // Muscles (old 44,46,48,50 -> new 32..35)
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

//     // Steps (old 31..34 -> new 24..27)
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

//     // Fingers (old 51..70 -> new 36..55)
//     float fingerThickness = 0.0025 * s;
//     float fingerRadius    = 0.0045 * s;
//     float fingerInfluence = 0.02;

//     // Front left fingers (new 36..40) attach to step 24
//     for (int i = 36; i < 41; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[24],
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }

//     // Front right fingers (new 41..45) attach to step 25
//     for (int i = 41; i < 46; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[25],
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }

//     // Back left fingers (new 46..50) attach to step 26
//     for (int i = 46; i < 51; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[26],
//                                   fingerThickness, fingerRadius, fingerInfluence);
//         bodySDF = min(bodySDF, sdf);
//     }

//     // Back right fingers (new 51..55) attach to step 27
//     for (int i = 51; i < 56; i++) {
//         float sdf = fingerSDFFunc(gecko_uv, u_geckoPoints[i], u_geckoPoints[27],
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

//     float geckoSDF = buildGeckoSDF(gecko_uv, s);
//     float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
//     vec3 geckoColor = endColor * geckoMask;
//     color = mix(color, geckoColor, geckoMask);

//     return half4(color, geckoMask);
// }
// `;



// 42 version



export const GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT = `  
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale; 

uniform float u_gecko_scale; 
uniform float u_gecko_size;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead; 
uniform vec2 u_hint; 

// COMPACT: 42 vec2 - NO CHANGES
uniform vec2 u_geckoPoints[40];

float TWO_PI = 6.28318530718;

// ------------------------------------------------
// SDF helpers (unchanged)
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
// ✅ DERIVE other fingers from first finger position
// ------------------------------------------------
vec2 calculateFinger(vec2 stepTarget, vec2 firstFinger, int fingerIndex) {
    const int numFingers = 5;
    const float fingerLen = 0.02;
    
    // ✅ Calculate base angle from first finger's actual position
    vec2 diff = firstFinger - stepTarget;
    float firstFingerAngle = atan(diff.y, diff.x);
    
    // The first finger is at fanStart, so work backwards from there
    float gapAngle = (2.0 * 3.14159265) / 1.7;
    float fanAngle = 2.0 * 3.14159265 - gapAngle;
    
    // fingerIndex 0 = first finger (at fanStart)
    // fingerIndex 4 = last finger (at fanStart + fanAngle)
    float t = float(fingerIndex) / float(numFingers - 1);
    float angle = firstFingerAngle + t * fanAngle;
    
    vec2 fingerPos;
    fingerPos.x = stepTarget.x + cos(angle) * fingerLen;
    fingerPos.y = stepTarget.y + sin(angle) * fingerLen;
    
    return fingerPos;
}

// ------------------------------------------------
// Transparent background
// ------------------------------------------------
float3 sampleBackground(float2 fragCoord) {
    return float3(0.0, 0.0, 0.0);
}

// ------------------------------------------------
// Gecko SDF Construction
// ------------------------------------------------
float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;

    // Body circles (0-11)
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

    // Arms (steps at 24-27, elbows at 28-31)
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

    // Muscles (32-35)
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

    // Steps (24-27)
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

    // ------------------------------------------------
    // ✅ Fingers - derive from first finger positions
    // ------------------------------------------------
    float fingerThickness = 0.0025 * s;
    float fingerRadius    = 0.0045 * s;
    float fingerInfluence = 0.02;

    vec2 stepFL = u_geckoPoints[24];
    vec2 stepFR = u_geckoPoints[25];
    vec2 stepBL = u_geckoPoints[26];
    vec2 stepBR = u_geckoPoints[27];
    
    vec2 firstFingerFL = u_geckoPoints[36];  // First finger front left
    vec2 firstFingerFR = u_geckoPoints[37];  // First finger front right
    vec2 firstFingerBL = u_geckoPoints[38];  // First finger back left
    vec2 firstFingerBR = u_geckoPoints[39];  // First finger back right
    
    // Front left fingers - derive all 5 from firstFingerFL
    for (int i = 0; i < 5; i++) {
        vec2 fingerPos = calculateFinger(stepFL, firstFingerFL, i);
        float sdf = fingerSDFFunc(gecko_uv, fingerPos, stepFL,
                                  fingerThickness, fingerRadius, fingerInfluence);
        bodySDF = min(bodySDF, sdf);
    }
    
    // Front right fingers - derive all 5 from firstFingerFR
    for (int i = 0; i < 5; i++) {
        vec2 fingerPos = calculateFinger(stepFR, firstFingerFR, i);
        float sdf = fingerSDFFunc(gecko_uv, fingerPos, stepFR,
                                  fingerThickness, fingerRadius, fingerInfluence);
        bodySDF = min(bodySDF, sdf);
    }
    
    // Back left fingers - derive all 5 from firstFingerBL
    for (int i = 0; i < 5; i++) {
        vec2 fingerPos = calculateFinger(stepBL, firstFingerBL, i);
        float sdf = fingerSDFFunc(gecko_uv, fingerPos, stepBL,
                                  fingerThickness, fingerRadius, fingerInfluence);
        bodySDF = min(bodySDF, sdf);
    }
    
    // Back right fingers - derive all 5 from firstFingerBR
    for (int i = 0; i < 5; i++) {
        vec2 fingerPos = calculateFinger(stepBR, firstFingerBR, i);
        float sdf = fingerSDFFunc(gecko_uv, fingerPos, stepBR,
                                  fingerThickness, fingerRadius, fingerInfluence);
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
    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    vec3 geckoColor = endColor * geckoMask;
    color = mix(color, geckoColor, geckoMask);

    return half4(color, geckoMask);
}
`;