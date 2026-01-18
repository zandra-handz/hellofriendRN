export const LIQUID_GLASS_MOMENTS_GECKO_GLSL = `

uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float2 u_moments[40];
uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;

uniform float u_gecko_scale;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_joints[15];
uniform vec2 u_head;
uniform vec2 u_snout;
uniform vec2 u_hint;
uniform vec2 u_tail[13];

uniform vec2 u_steps[4];
uniform vec2 u_elbows[4];
uniform vec2 u_shoulders[4];
uniform vec2 u_muscles[8];
uniform vec2 u_fingers[20];

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

float3 getNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 2.0;
    float dx = sdfRect(c, s, frag + float2(eps,0), r)
             - sdfRect(c, s, frag - float2(eps,0), r);
    float dy = sdfRect(c, s, frag + float2(0,eps), r)
             - sdfRect(c, s, frag - float2(0,eps), r);

    float2 g = normalize(float2(dx, dy));
    float n_cos = max(thickness + sd, 0.0) / thickness;
    float n_sin = sqrt(max(1.0 - n_cos*n_cos, 0.0));

    return normalize(float3(g * n_cos, n_sin));
}



float3 getCheapNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 1.5;

    // Forward differences (2 SDF samples instead of 4)
    float sd_x = sdfRect(c, s, frag + float2(eps, 0.0), r);
    float sd_y = sdfRect(c, s, frag + float2(0.0, eps), r);

    float2 g = float2(sd_x - sd, sd_y - sd);

    // Z = thickness biases the normal "up" for glass bulge
    return normalize(float3(g, thickness));
}


float3 getRectNormal(
    float2 frag,
    float2 center,
    float2 size
) {
    float2 d = frag - center;
    float2 q = abs(d) - size;

    float2 n2;
    if (q.x > q.y) {
        n2 = float2(sign(d.x), 0.0);
    } else {
        n2 = float2(0.0, sign(d.y));
    }

    return normalize(float3(n2, 1.0));
}


// ------------------------------------------------
// Background sampling
// ------------------------------------------------

float3 sampleBackground(float2 fragCoord) {
    float2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    uv /= u_scale;

    float pixelY = uv.y * u_resolution.y;
    float stripe = step(1.0, mod(pixelY / 20.0, 2.0));

    float t = clamp(uv.y + 0.5, 0.0, 1.0);
    float3 grad = mix(backgroundStartColor, backgroundEndColor, t);


    return mix(grad, grad * 0.6, stripe);
}




// ------------------------------------------------
// Background sampling - NO STRIPES
// ------------------------------------------------

// float3 sampleBackground(float2 fragCoord) {
//     float2 uv = fragCoord / u_resolution;
//     uv -= 0.5;
//     uv.x *= u_aspect;
//     uv /= u_scale;

//     // Simple vertical gradient without stripes
//     float t = clamp(uv.y + 0.5, 0.0, 1.0);
//    float3 grad = mix(backgroundStartColor, backgroundEndColor, t);

//     return grad;
// }

// ------------------------------------------------
// Liquid glass lens
// ------------------------------------------------

float3 applyGlass(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float baseHeight = thickness * 10.0;
    float2 size = float2(2.0);

    float sd = sdfRect(centerPx, size, fragCoord, radius);
    if (sd >= 0.0) return baseColor;

    // float3 normal = getCheapNormal(
    //     fragCoord,
    //     centerPx,
    //     size,
    //     radius,
    //     sd,
    //     thickness
    // );


    
    float3 normal = getNormal(
        fragCoord,
        centerPx,
        size,
        radius,
        sd,
        thickness
    );


    float h = heightFunc(sd, thickness);

    // CHEAPER/ADDED: cut off
        if (h < 0.001) {
        return baseColor;
    }

    float3 incident = float3(0.0, 0.0, -1.0);
    float3 refr = refract(incident, normal, 1.0 / ior);

    float travel = (h + baseHeight) / max(0.001, abs(refr.z));
    float2 refrCoord = fragCoord + refr.xy * travel * 3.5;


    // CHEAPER option 1:
    float edge = smoothstep(0.0, thickness * 0.5, -sd);
    float3 refractedColor = mix(baseColor, sampleBackground(refrCoord), edge);

    // OG option 2:
    // float3 refractedColor = sampleBackground(refrCoord);



    //option 1:
    // float fresnel = pow(1.0 - normal.z, 2.0);

    //CHEAPER option 2:
    float t = 1.0 - normal.z;
    float fresnel = t * t;


    float3 reflectCol = float3(fresnel * 0.4);

    float3 col = mix(refractedColor, reflectCol, fresnel);
    return mix(col, float3(1.0), 0.25);
}


// ------------------------------------------------
// SIMPLE Liquid glass lens (optimized for mobile)
// ------------------------------------------------

float3 applyGlassSimple(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float2 size = float2(2.0);
    float sd = sdfRect(centerPx, size, fragCoord, radius);
    
    if (sd >= 0.0) return baseColor;
    
    // QUICK DISTANCE CHECK - skip if far
    float dist = distance(fragCoord, centerPx);
    if (dist > radius * 3.0) return baseColor;
    
    // SIMPLE DISTORTION (no refract())
    float distortion = (thickness + sd) * 0.25;
    float2 dir = normalize(fragCoord - centerPx);
    float2 refrCoord = fragCoord + dir * distortion * 2.0;
    
    float3 refractedColor = sampleBackground(refrCoord);
    
    // Simple fresnel approximation
    float inside = clamp(-sd / thickness, 0.0, 1.0);
    float fresnel = (1.0 - inside) * (1.0 - inside);
    
    float3 reflectCol = float3(fresnel * 0.3);
    float3 col = mix(refractedColor, reflectCol, fresnel * 0.5);
    
    // Fade out near edges
    float strength = clamp(1.0 - (dist / (radius * 2.0)), 0.0, 1.0);
    strength *= (1.0 - inside * 0.5);
    
    return mix(baseColor, col, strength);
}



float3 applyGlassDotSq(
    float dist2,
    float radius,
    float3 baseColor
) {
    float r0 = radius - 1.0;
    float r1 = radius + 1.0;

    float circle = smoothstep(r1*r1, r0*r0, dist2);
    float highlight = smoothstep((radius*0.5)*(radius*0.5), 0.0, dist2) * 0.3;

    float3 dotColor = float3(circle + highlight);
    return mix(baseColor, dotColor, circle * 0.8);
}



// ------------------------------------------------
// SIMPLE DOT (no glass effect at all)
// ------------------------------------------------

float3 applyGlassDot(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    // Just draw a solid circle - no glass, no refraction
    float dist = distance(fragCoord, centerPx);
    
    // Smooth circle edge
    float circle = smoothstep(radius + 1.0, radius - 1.0, dist);
    
    // Simple highlight in center
    float highlight = smoothstep(radius * 0.5, 0.0, dist) * 0.3;
    
    // Mix with base color
    float3 dotColor = float3(1.0, 1.0, 1.0) * (circle + highlight);
    
    return mix(baseColor, dotColor, circle * 0.8);
}
// ------------------------------------------------
// Gecko SDF Construction
// ------------------------------------------------

float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;
    
    // Main body circles
    float circle0 = distFCircle(gecko_uv, u_snout, 0.003 * s / circleSizeDiv);
    float circle1 = distFCircle(gecko_uv, u_head, 0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_joints[1], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(gecko_uv, u_joints[2], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_joints[3], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_joints[4], 0.004 * s / circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_joints[5], 0.004 * s / circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_joints[6], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_joints[7], 0.003 * s / circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_joints[8], 0.003 * s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_joints[9], 0.003 * s / circleSizeDiv);
    // float circle10 = distFCircle(gecko_uv, u_joints[10], 0.003 * s / circleSizeDiv);
    // float circle11 = distFCircle(gecko_uv, u_joints[11], 0.003 * s / circleSizeDiv);
    // float circle12 = distFCircle(gecko_uv, u_joints[12], 0.002 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_joints[13], 0.002 * s / circleSizeDiv);
    // float circle14 = distFCircle(gecko_uv, u_joints[14], 0.0004 * s / circleSizeDiv);

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
    float tailCircle0 = distFCircle(gecko_uv, u_tail[0], 0.002 * s / circleSizeDiv);
    float tailCircle1 = distFCircle(gecko_uv, u_tail[1], 0.005 * s / circleSizeDiv);
    float tailCircle2 = distFCircle(gecko_uv, u_tail[2], 0.004 * s / circleSizeDiv);
    float tailCircle3 = distFCircle(gecko_uv, u_tail[3], 0.0042 * s / circleSizeDiv);
    float tailCircle4 = distFCircle(gecko_uv, u_tail[4], 0.005 * s / circleSizeDiv);
    float tailCircle5 = distFCircle(gecko_uv, u_tail[5], 0.005 * s / circleSizeDiv);
    float tailCircle6 = distFCircle(gecko_uv, u_tail[6], 0.005 * s / circleSizeDiv);
    float tailCircle7 = distFCircle(gecko_uv, u_tail[7], 0.004 * s / circleSizeDiv);
    float tailCircle8 = distFCircle(gecko_uv, u_tail[8], 0.0027 * s / circleSizeDiv);
    float tailCircle9 = distFCircle(gecko_uv, u_tail[9], 0.002 * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_tail[10], 0.001 * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_tail[11], 0.0001 * s / circleSizeDiv);
    float tailCircle12 = distFCircle(gecko_uv, u_tail[12], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    float blendAmt = 0.054 * s;
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt + .04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.005 * s;
    float backArmThickness = .007 * s;
    float shoulderBlend = 0.01 * s;

    float arm0Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[0]);
    float arm0Lower = lineSegmentSDF(gecko_uv, u_elbows[0], u_steps[0]);
    float arm1Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[1]);
    float arm1Lower = lineSegmentSDF(gecko_uv, u_elbows[1], u_steps[1]);
    float arm2Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[2]);
    float arm2Lower = lineSegmentSDF(gecko_uv, u_elbows[2], u_steps[2]);
    float arm3Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[3]);
    float arm3Lower = lineSegmentSDF(gecko_uv, u_elbows[3], u_steps[3]);

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
    float lowerMuscleRadius = .001 * s;
    float upperMuscleRadius = 0.005 * s;

    float musclesSDF1 = distFCircle(gecko_uv, u_muscles[1], upperMuscleRadius);
    float musclesSDF3 = distFCircle(gecko_uv, u_muscles[3], upperMuscleRadius);
    float musclesSDF5 = distFCircle(gecko_uv, u_muscles[5], upperMuscleRadius);
    float musclesSDF7 = distFCircle(gecko_uv, u_muscles[7], upperMuscleRadius);

    bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

    // Steps
    float stepBlend = 0.003 * s;
    float stepRadius = .007 * s;

    float stepSDF0 = distFCircle(gecko_uv, u_steps[0], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_steps[1], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_steps[2], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_steps[3], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);







    // Fingers
    float fingerThickness = 0.0025 * s;
    float fingerRadius = 0.0015 * s;
    float fingerLineBlend = .0025 * s;
    float fingerBlend = 0.01 * s;

    // Front left fingers (0-4)
    for (int i = 0; i < 5; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[0]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Front right fingers (5-9)
    for (int i = 5; i < 10; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[1]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Back left fingers (10-14)
    for (int i = 10; i < 15; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[2]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Back right fingers (15-19)
    for (int i = 15; i < 20; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[3]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    return bodySDF;
}

// ------------------------------------------------
// MAIN
// ------------------------------------------------

half4 main(float2 fragCoord) {
    // Base background
    float3 baseBackground = sampleBackground(fragCoord);
    float3 color = baseBackground;
 

    

   // 1. Apply FULL glass to lastSelected
    float2 lastSelectedCenter = u_lastSelected * u_resolution;
    
    // Check if lastSelected is valid (not default [-100, -100])
    if (length(u_lastSelected) < 10.0) { // Adjust threshold as needed







        color = applyGlass(
            fragCoord,
            lastSelectedCenter,
            84.0,      // radius
            10.0,      // thickness
            1.8,       // ior
            color
        );
    }
    
    // 2. Apply SIMPLE glass to regular moments
    for (int i = 0; i < 40; i++) {
        if (i >= u_momentsLength) break;
        
        // Skip if this moment is the lastSelected (already processed)
        if (distance(u_moments[i], u_lastSelected) < 0.001) continue;
        
        float2 momentCenter = u_moments[i] * u_resolution;
        
        float2 d = fragCoord - momentCenter;
        float dist2 = dot(d, d);

        float maxR = 19.0; // radius + edge
        if (dist2 > maxR * maxR) continue;


        // // Quick distance check
        // float dist = distance(fragCoord, momentCenter);
        // if (dist > 100.0) continue; // Skip if too far


        color = applyGlassDotSq(dist2, 18.0, color);

        
        // color = applyGlassDot(
        //     fragCoord,
        //     momentCenter,
        //     18.0,    // smaller radius
        //     4.0,     // thinner
        //     1.6,     // slightly softer IOR
        //     color
        // );
    }
    


    
    // NOW add the gecko shape on top - SOLID, NOT TRANSPARENT
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    
    // Gecko coordinates
    vec2 gecko_uv = uv / u_gecko_scale;
    float s = 1.0 / u_gecko_scale;
    
    // Build gecko SDF
    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    
    // SOLID gecko color using endColor
    vec3 geckoColor = endColor * geckoMask;
     
    
    // Create selected dot - solid
    vec2 scaled_uv = uv / u_scale;
    vec2 selected_uv = u_selected;
    float selectedMask = step(distance(scaled_uv, selected_uv), 0.03);
    vec3 selectedColor = endColor * selectedMask;
    
    // Composite gecko elements ON TOP of glass effects
    // Use mix() to make it completely solid where the mask is 1.0
    color = mix(color, geckoColor, geckoMask); 
    color = mix(color, selectedColor, selectedMask);
    
    return half4(color, 1.0);
}

`;























export const GECKO_ONLY_TRANSPARENT_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float2 u_moments[40];
uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;

uniform float u_gecko_scale;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_joints[15];
uniform vec2 u_head;
uniform vec2 u_snout;
uniform vec2 u_hint;
uniform vec2 u_tail[13];
uniform vec2 u_steps[4];
uniform vec2 u_elbows[4];
uniform vec2 u_shoulders[4];
uniform vec2 u_muscles[8];
uniform vec2 u_fingers[20];

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
    // Fully transparent background (black with alpha handled separately)
    return float3(0.0, 0.0, 0.0);
}

 
 
 
// ------------------------------------------------
// Gecko SDF Construction (all body parts included)
// ------------------------------------------------

float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;
    
    // Main body circles
    float circle0 = distFCircle(gecko_uv, u_snout, 0.003 * s / circleSizeDiv);
    float circle1 = distFCircle(gecko_uv, u_head, 0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_joints[1], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(gecko_uv, u_joints[2], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_joints[3], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_joints[4], 0.004 * s / circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_joints[5], 0.004 * s / circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_joints[6], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_joints[7], 0.003 * s / circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_joints[8], 0.003 * s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_joints[9], 0.003 * s / circleSizeDiv);
    // float circle10 = distFCircle(gecko_uv, u_joints[10], 0.003 * s / circleSizeDiv);
    // float circle11 = distFCircle(gecko_uv, u_joints[11], 0.003 * s / circleSizeDiv);
    // float circle12 = distFCircle(gecko_uv, u_joints[12], 0.002 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_joints[13], 0.002 * s / circleSizeDiv);
    // float circle14 = distFCircle(gecko_uv, u_joints[14], 0.0004 * s / circleSizeDiv);

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
    float tailCircle0 = distFCircle(gecko_uv, u_tail[0], 0.002 * s / circleSizeDiv);
    float tailCircle1 = distFCircle(gecko_uv, u_tail[1], 0.005 * s / circleSizeDiv);
    float tailCircle2 = distFCircle(gecko_uv, u_tail[2], 0.004 * s / circleSizeDiv);
    float tailCircle3 = distFCircle(gecko_uv, u_tail[3], 0.0042 * s / circleSizeDiv);
    float tailCircle4 = distFCircle(gecko_uv, u_tail[4], 0.005 * s / circleSizeDiv);
    float tailCircle5 = distFCircle(gecko_uv, u_tail[5], 0.005 * s / circleSizeDiv);
    float tailCircle6 = distFCircle(gecko_uv, u_tail[6], 0.005 * s / circleSizeDiv);
    float tailCircle7 = distFCircle(gecko_uv, u_tail[7], 0.004 * s / circleSizeDiv);
    float tailCircle8 = distFCircle(gecko_uv, u_tail[8], 0.0027 * s / circleSizeDiv);
    float tailCircle9 = distFCircle(gecko_uv, u_tail[9], 0.002 * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_tail[10], 0.001 * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_tail[11], 0.0001 * s / circleSizeDiv);
    float tailCircle12 = distFCircle(gecko_uv, u_tail[12], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    float blendAmt = 0.054 * s;
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt + .04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.005 * s;
    float backArmThickness = .007 * s;
    float shoulderBlend = 0.01 * s;

    float arm0Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[0]);
    float arm0Lower = lineSegmentSDF(gecko_uv, u_elbows[0], u_steps[0]);
    float arm1Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[1]);
    float arm1Lower = lineSegmentSDF(gecko_uv, u_elbows[1], u_steps[1]);
    float arm2Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[2]);
    float arm2Lower = lineSegmentSDF(gecko_uv, u_elbows[2], u_steps[2]);
    float arm3Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[3]);
    float arm3Lower = lineSegmentSDF(gecko_uv, u_elbows[3], u_steps[3]);

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
    float lowerMuscleRadius = .001 * s;
    float upperMuscleRadius = 0.005 * s;

    float musclesSDF1 = distFCircle(gecko_uv, u_muscles[1], upperMuscleRadius);
    float musclesSDF3 = distFCircle(gecko_uv, u_muscles[3], upperMuscleRadius);
    float musclesSDF5 = distFCircle(gecko_uv, u_muscles[5], upperMuscleRadius);
    float musclesSDF7 = distFCircle(gecko_uv, u_muscles[7], upperMuscleRadius);

    bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

    // Steps
    float stepBlend = 0.003 * s;
    float stepRadius = .007 * s;

    float stepSDF0 = distFCircle(gecko_uv, u_steps[0], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_steps[1], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_steps[2], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_steps[3], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);





// Fingers – Optimized but fully rendered
float fingerThickness = 0.0025 * s;
float fingerRadius    = 0.0045 * s;

// Bounding box threshold: skip pixels clearly outside finger influence
float bbThreshold = 0.02; // tweak to cover finger + line

// --- Front left fingers (0-4) ---
for (int i = 0; i < 5; i++) {
    vec2 diff = gecko_uv - u_fingers[i];
    if (abs(diff.x) < bbThreshold && abs(diff.y) < bbThreshold) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[0]) - fingerThickness;
        float fingerTip  = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        float fingerSDF  = min(fingerLine, fingerTip);  // hard union
        bodySDF = min(bodySDF, fingerSDF);
    }
}

// --- Front right fingers (5-9) ---
for (int i = 5; i < 10; i++) {
    vec2 diff = gecko_uv - u_fingers[i];
    if (abs(diff.x) < bbThreshold && abs(diff.y) < bbThreshold) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[1]) - fingerThickness;
        float fingerTip  = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        float fingerSDF  = min(fingerLine, fingerTip);
        bodySDF = min(bodySDF, fingerSDF);
    }
}

// --- Back left fingers (10-14) ---
for (int i = 10; i < 15; i++) {
    vec2 diff = gecko_uv - u_fingers[i];
    if (abs(diff.x) < bbThreshold && abs(diff.y) < bbThreshold) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[2]) - fingerThickness;
        float fingerTip  = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        float fingerSDF  = min(fingerLine, fingerTip);
        bodySDF = min(bodySDF, fingerSDF);
    }
}

// --- Back right fingers (15-19) ---
for (int i = 15; i < 20; i++) {
    vec2 diff = gecko_uv - u_fingers[i];
    if (abs(diff.x) < bbThreshold && abs(diff.y) < bbThreshold) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[3]) - fingerThickness;
        float fingerTip  = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        float fingerSDF  = min(fingerLine, fingerTip);
        bodySDF = min(bodySDF, fingerSDF);
    }
}



    return bodySDF;
}

// ------------------------------------------------
// MAIN
// ------------------------------------------------
half4 main(float2 fragCoord) {
    // Transparent background
    float3 color = sampleBackground(fragCoord);

    // Gecko
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    vec2 gecko_uv = uv / u_gecko_scale;
    float s = 1.0 / u_gecko_scale;
    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    vec3 geckoColor = endColor * geckoMask;
    color = mix(color, geckoColor, geckoMask);

    return half4(color, geckoMask); // <--- fully transparent background
}
`;

 



















 export const MOMENTS_BG_SKSL = `

uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float2 u_moments[40];
uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;

uniform float u_gecko_scale;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_joints[15];
uniform vec2 u_head;
uniform vec2 u_snout;
uniform vec2 u_hint;
uniform vec2 u_tail[13];

uniform vec2 u_steps[4];
uniform vec2 u_elbows[4];
uniform vec2 u_shoulders[4];
uniform vec2 u_muscles[8];
uniform vec2 u_fingers[20];

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

float3 getNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 2.0;
    float dx = sdfRect(c, s, frag + float2(eps,0), r)
             - sdfRect(c, s, frag - float2(eps,0), r);
    float dy = sdfRect(c, s, frag + float2(0,eps), r)
             - sdfRect(c, s, frag - float2(0,eps), r);

    float2 g = normalize(float2(dx, dy));
    float n_cos = max(thickness + sd, 0.0) / thickness;
    float n_sin = sqrt(max(1.0 - n_cos*n_cos, 0.0));

    return normalize(float3(g * n_cos, n_sin));
}



float3 getCheapNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 1.5;

    // Forward differences (2 SDF samples instead of 4)
    float sd_x = sdfRect(c, s, frag + float2(eps, 0.0), r);
    float sd_y = sdfRect(c, s, frag + float2(0.0, eps), r);

    float2 g = float2(sd_x - sd, sd_y - sd);

    // Z = thickness biases the normal "up" for glass bulge
    return normalize(float3(g, thickness));
}


float3 getRectNormal(
    float2 frag,
    float2 center,
    float2 size
) {
    float2 d = frag - center;
    float2 q = abs(d) - size;

    float2 n2;
    if (q.x > q.y) {
        n2 = float2(sign(d.x), 0.0);
    } else {
        n2 = float2(0.0, sign(d.y));
    }

    return normalize(float3(n2, 1.0));
}


// ------------------------------------------------
// Background sampling
// ------------------------------------------------

float3 sampleBackground(float2 fragCoord) {
    float2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    uv /= u_scale;

    float pixelY = uv.y * u_resolution.y;
    float stripe = step(1.0, mod(pixelY / 20.0, 2.0));

    float t = clamp(uv.y + 0.5, 0.0, 1.0);
    float3 grad = mix(backgroundStartColor, backgroundEndColor, t);


    return mix(grad, grad * 0.6, stripe);
}




// ------------------------------------------------
// Background sampling - NO STRIPES
// ------------------------------------------------

// float3 sampleBackground(float2 fragCoord) {
//     float2 uv = fragCoord / u_resolution;
//     uv -= 0.5;
//     uv.x *= u_aspect;
//     uv /= u_scale;

//     // Simple vertical gradient without stripes
//     float t = clamp(uv.y + 0.5, 0.0, 1.0);
//    float3 grad = mix(backgroundStartColor, backgroundEndColor, t);

//     return grad;
// }

// ------------------------------------------------
// Liquid glass lens
// ------------------------------------------------

float3 applyGlass(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float baseHeight = thickness * 30.0; // 10 for stripes
    float2 size = float2(2.0);

    float sd = sdfRect(centerPx, size, fragCoord, radius);
    if (sd >= 0.0) return baseColor;

    // float3 normal = getCheapNormal(
    //     fragCoord,
    //     centerPx,
    //     size,
    //     radius,
    //     sd,
    //     thickness
    // );


    
    float3 normal = getNormal(
        fragCoord,
        centerPx,
        size,
        radius,
        sd,
        thickness
    );


    float h = heightFunc(sd, thickness);

    // CHEAPER/ADDED: cut off
        if (h < 0.001) {
        return baseColor;
    }

    float3 incident = float3(0.0, 0.0, -1.0);
    float3 refr = refract(incident, normal, 1.0 / ior);

    float travel = (h + baseHeight) / max(0.001, abs(refr.z));
    float2 refrCoord = fragCoord + refr.xy * travel * 3.5;


    // CHEAPER option 1:
    float edge = smoothstep(0.0, thickness * 0.5, -sd);
    float3 refractedColor = mix(baseColor, sampleBackground(refrCoord), edge);

    // OG option 2:
    // float3 refractedColor = sampleBackground(refrCoord);



    //option 1:
    // float fresnel = pow(1.0 - normal.z, 2.0);

    //CHEAPER option 2:
    float t = 1.0 - normal.z;
    float fresnel = t * t;


    float3 reflectCol = float3(fresnel * 0.4);

    float3 col = mix(refractedColor, reflectCol, fresnel);
    return mix(col, float3(1.0), 0.25);
}


// ------------------------------------------------
// SIMPLE Liquid glass lens (optimized for mobile)
// ------------------------------------------------

float3 applyGlassSimple(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float2 size = float2(2.0);
    float sd = sdfRect(centerPx, size, fragCoord, radius);
    
    if (sd >= 0.0) return baseColor;
    
    // QUICK DISTANCE CHECK - skip if far
    float dist = distance(fragCoord, centerPx);
    if (dist > radius * 3.0) return baseColor;
    
    // SIMPLE DISTORTION (no refract())
    float distortion = (thickness + sd) * 0.25;
    float2 dir = normalize(fragCoord - centerPx);
    float2 refrCoord = fragCoord + dir * distortion * 2.0;
    
    float3 refractedColor = sampleBackground(refrCoord);
    
    // Simple fresnel approximation
    float inside = clamp(-sd / thickness, 0.0, 1.0);
    float fresnel = (1.0 - inside) * (1.0 - inside);
    
    float3 reflectCol = float3(fresnel * 0.3);
    float3 col = mix(refractedColor, reflectCol, fresnel * 0.5);
    
    // Fade out near edges
    float strength = clamp(1.0 - (dist / (radius * 2.0)), 0.0, 1.0);
    strength *= (1.0 - inside * 0.5);
    
    return mix(baseColor, col, strength);
}



float3 applyGlassDotSq(
    float dist2,
    float radius,
    float3 baseColor
) {
    float r0 = radius - 1.0;
    float r1 = radius + 1.0;

    float circle = smoothstep(r1*r1, r0*r0, dist2);
    float highlight = smoothstep((radius*0.5)*(radius*0.5), 0.0, dist2) * 0.3;

    float3 dotColor = float3(circle + highlight);
    return mix(baseColor, dotColor, circle * 0.8);
}



// ------------------------------------------------
// SIMPLE DOT (no glass effect at all)
// ------------------------------------------------

float3 applyGlassDot(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    // Just draw a solid circle - no glass, no refraction
    float dist = distance(fragCoord, centerPx);
    
    // Smooth circle edge
    float circle = smoothstep(radius + 1.0, radius - 1.0, dist);
    
    // Simple highlight in center
    float highlight = smoothstep(radius * 0.5, 0.0, dist) * 0.3;
    
    // Mix with base color
    float3 dotColor = float3(1.0, 1.0, 1.0) * (circle + highlight);
    
    return mix(baseColor, dotColor, circle * 0.8);
}
 
// ------------------------------------------------
// MAIN
// ------------------------------------------------

half4 main(float2 fragCoord) {
    // Base background
    float3 baseBackground = sampleBackground(fragCoord);
    float3 color = baseBackground;
 

    

   // 1. Apply FULL glass to lastSelected
    float2 lastSelectedCenter = u_lastSelected * u_resolution;
    
    // Check if lastSelected is valid (not default [-100, -100])
    if (length(u_lastSelected) < 10.0) { // Adjust threshold as needed







        color = applyGlass(
            fragCoord,
            lastSelectedCenter,
            34.0,      // radius
            10.0,      // thickness
            1.8,       // ior
            color
        );
    }
    
    // 2. Apply SIMPLE glass to regular moments
    for (int i = 0; i < 40; i++) {
        if (i >= u_momentsLength) break;
        
        // Skip if this moment is the lastSelected (already processed)
        if (distance(u_moments[i], u_lastSelected) < 0.001) continue;
        
        float2 momentCenter = u_moments[i] * u_resolution;
        
        float2 d = fragCoord - momentCenter;
        float dist2 = dot(d, d);

        float maxR = 19.0; // radius + edge
        if (dist2 > maxR * maxR) continue;


        // // Quick distance check
        // float dist = distance(fragCoord, momentCenter);
        // if (dist > 100.0) continue; // Skip if too far


        color = applyGlassDotSq(dist2, 18.0, color);

        
        // color = applyGlassDot(
        //     fragCoord,
        //     momentCenter,
        //     18.0,    // smaller radius
        //     4.0,     // thinner
        //     1.6,     // slightly softer IOR
        //     color
        // );
    }
    


    
    // NOW add the gecko shape on top - SOLID, NOT TRANSPARENT
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
       
    vec2 scaled_uv = uv / u_scale;
    vec2 selected_uv = u_selected;
    float selectedMask = step(distance(scaled_uv, selected_uv), 0.03);
    vec3 selectedColor = endColor * selectedMask;
     
    color = mix(color, selectedColor, selectedMask);
    
    return half4(color, 1.0);
}

`;
















 

















export const GECKO_MOMENTS_TRANSPARENT_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;

uniform float2 u_moments[40];
uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;

uniform float u_gecko_scale;
uniform float u_time;
uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_joints[15];
uniform vec2 u_head;
uniform vec2 u_snout;
uniform vec2 u_hint;
uniform vec2 u_tail[13];
uniform vec2 u_steps[4];
uniform vec2 u_elbows[4];
uniform vec2 u_shoulders[4];
uniform vec2 u_muscles[8];
uniform vec2 u_fingers[20];

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

float3 getNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 2.0;
    float dx = sdfRect(c, s, frag + float2(eps,0), r)
             - sdfRect(c, s, frag - float2(eps,0), r);
    float dy = sdfRect(c, s, frag + float2(0,eps), r)
             - sdfRect(c, s, frag - float2(0,eps), r);

    float2 g = normalize(float2(dx, dy));
    float n_cos = max(thickness + sd, 0.0) / thickness;
    float n_sin = sqrt(max(1.0 - n_cos*n_cos, 0.0));

    return normalize(float3(g * n_cos, n_sin));
}

float3 getCheapNormal(
    float2 frag,
    float2 c,
    float2 s,
    float r,
    float sd,
    float thickness
) {
    float eps = 1.5;
    float sd_x = sdfRect(c, s, frag + float2(eps, 0.0), r);
    float sd_y = sdfRect(c, s, frag + float2(0.0, eps), r);
    float2 g = float2(sd_x - sd, sd_y - sd);
    return normalize(float3(g, thickness));
}

float3 getRectNormal(
    float2 frag,
    float2 center,
    float2 size
) {
    float2 d = frag - center;
    float2 q = abs(d) - size;
    float2 n2;
    if (q.x > q.y) {
        n2 = float2(sign(d.x), 0.0);
    } else {
        n2 = float2(0.0, sign(d.y));
    }
    return normalize(float3(n2, 1.0));
}

// ------------------------------------------------
// Transparent background
// ------------------------------------------------
float3 sampleBackground(float2 fragCoord) {
    // Fully transparent background (black with alpha handled separately)
    return float3(0.0, 0.0, 0.0);
}

// ------------------------------------------------
// Glass dots
// ------------------------------------------------
float3 applyGlassDotSq(
    float dist2,
    float radius,
    float3 baseColor
) {
    float r0 = radius - 1.0;
    float r1 = radius + 1.0;
    float circle = smoothstep(r1*r1, r0*r0, dist2);
    float highlight = smoothstep((radius*0.5)*(radius*0.5), 0.0, dist2) * 0.3;
    float3 dotColor = float3(circle + highlight);
    return mix(baseColor, dotColor, circle * 0.8);
}

float3 applyGlassDot(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float dist = distance(fragCoord, centerPx);
    float circle = smoothstep(radius + 1.0, radius - 1.0, dist);
    float highlight = smoothstep(radius * 0.5, 0.0, dist) * 0.3;
    float3 dotColor = float3(1.0, 1.0, 1.0) * (circle + highlight);
    return mix(baseColor, dotColor, circle * 0.8);
}

// ------------------------------------------------
// Liquid glass lens
// ------------------------------------------------
float3 applyGlass(
    float2 fragCoord,
    float2 centerPx,
    float radius,
    float thickness,
    float ior,
    float3 baseColor
) {
    float baseHeight = thickness * 10.0;
    float2 size = float2(2.0);
    float sd = sdfRect(centerPx, size, fragCoord, radius);
    if (sd >= 0.0) return baseColor;
    float3 normal = getNormal(fragCoord, centerPx, size, radius, sd, thickness);
    float h = heightFunc(sd, thickness);
    if (h < 0.001) return baseColor;
    float3 incident = float3(0.0, 0.0, -1.0);
    float3 refr = refract(incident, normal, 1.0 / ior);
    float travel = (h + baseHeight) / max(0.001, abs(refr.z));
    float2 refrCoord = fragCoord + refr.xy * travel * 3.5;
    float edge = smoothstep(0.0, thickness * 0.5, -sd);
    float3 refractedColor = mix(baseColor, sampleBackground(refrCoord), edge);
    float t = 1.0 - normal.z;
    float fresnel = t * t;
    float3 reflectCol = float3(fresnel * 0.4);
    float3 col = mix(refractedColor, reflectCol, fresnel);
    return mix(col, float3(1.0), 0.25);
}

// ------------------------------------------------
// Gecko SDF Construction (all body parts included)
// ------------------------------------------------

float buildGeckoSDF(vec2 gecko_uv, float s) {
    float circleSizeDiv = .8;
    
    // Main body circles
    float circle0 = distFCircle(gecko_uv, u_snout, 0.003 * s / circleSizeDiv);
    float circle1 = distFCircle(gecko_uv, u_head, 0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_joints[1], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(gecko_uv, u_joints[2], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_joints[3], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_joints[4], 0.004 * s / circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_joints[5], 0.004 * s / circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_joints[6], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_joints[7], 0.003 * s / circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_joints[8], 0.003 * s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_joints[9], 0.003 * s / circleSizeDiv);
    // float circle10 = distFCircle(gecko_uv, u_joints[10], 0.003 * s / circleSizeDiv);
    // float circle11 = distFCircle(gecko_uv, u_joints[11], 0.003 * s / circleSizeDiv);
    // float circle12 = distFCircle(gecko_uv, u_joints[12], 0.002 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_joints[13], 0.002 * s / circleSizeDiv);
    // float circle14 = distFCircle(gecko_uv, u_joints[14], 0.0004 * s / circleSizeDiv);

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
    float tailCircle0 = distFCircle(gecko_uv, u_tail[0], 0.002 * s / circleSizeDiv);
    float tailCircle1 = distFCircle(gecko_uv, u_tail[1], 0.005 * s / circleSizeDiv);
    float tailCircle2 = distFCircle(gecko_uv, u_tail[2], 0.004 * s / circleSizeDiv);
    float tailCircle3 = distFCircle(gecko_uv, u_tail[3], 0.0042 * s / circleSizeDiv);
    float tailCircle4 = distFCircle(gecko_uv, u_tail[4], 0.005 * s / circleSizeDiv);
    float tailCircle5 = distFCircle(gecko_uv, u_tail[5], 0.005 * s / circleSizeDiv);
    float tailCircle6 = distFCircle(gecko_uv, u_tail[6], 0.005 * s / circleSizeDiv);
    float tailCircle7 = distFCircle(gecko_uv, u_tail[7], 0.004 * s / circleSizeDiv);
    float tailCircle8 = distFCircle(gecko_uv, u_tail[8], 0.0027 * s / circleSizeDiv);
    float tailCircle9 = distFCircle(gecko_uv, u_tail[9], 0.002 * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_tail[10], 0.001 * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_tail[11], 0.0001 * s / circleSizeDiv);
    float tailCircle12 = distFCircle(gecko_uv, u_tail[12], 0.0001 * s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    float blendAmt = 0.054 * s;
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt + .04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.005 * s;
    float backArmThickness = .007 * s;
    float shoulderBlend = 0.01 * s;

    float arm0Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[0]);
    float arm0Lower = lineSegmentSDF(gecko_uv, u_elbows[0], u_steps[0]);
    float arm1Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[1]);
    float arm1Lower = lineSegmentSDF(gecko_uv, u_elbows[1], u_steps[1]);
    float arm2Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[2]);
    float arm2Lower = lineSegmentSDF(gecko_uv, u_elbows[2], u_steps[2]);
    float arm3Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[3]);
    float arm3Lower = lineSegmentSDF(gecko_uv, u_elbows[3], u_steps[3]);

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
    float lowerMuscleRadius = .001 * s;
    float upperMuscleRadius = 0.005 * s;

    float musclesSDF1 = distFCircle(gecko_uv, u_muscles[1], upperMuscleRadius);
    float musclesSDF3 = distFCircle(gecko_uv, u_muscles[3], upperMuscleRadius);
    float musclesSDF5 = distFCircle(gecko_uv, u_muscles[5], upperMuscleRadius);
    float musclesSDF7 = distFCircle(gecko_uv, u_muscles[7], upperMuscleRadius);

    bodySDF = smoothMin(bodySDF, musclesSDF1, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF3, muscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF5, backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7, backMuscleBlend);

    // Steps
    float stepBlend = 0.003 * s;
    float stepRadius = .007 * s;

    float stepSDF0 = distFCircle(gecko_uv, u_steps[0], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_steps[1], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_steps[2], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_steps[3], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);







    // Fingers
    float fingerThickness = 0.0025 * s;
    float fingerRadius = 0.0015 * s;
    float fingerLineBlend = .0025 * s;
    float fingerBlend = 0.01 * s;

    // Front left fingers (0-4)
    for (int i = 0; i < 5; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[0]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Front right fingers (5-9)
    for (int i = 5; i < 10; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[1]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Back left fingers (10-14)
    for (int i = 10; i < 15; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[2]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    // Back right fingers (15-19)
    for (int i = 15; i < 20; i++) {
        float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[3]) - fingerThickness;
        float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
        bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    }

    return bodySDF;
}

// ------------------------------------------------
// MAIN
// ------------------------------------------------
half4 main(float2 fragCoord) {
    // Transparent background
    float3 color = sampleBackground(fragCoord);

    // Apply FULL glass to lastSelected
    float2 lastSelectedCenter = u_lastSelected * u_resolution;
    if (length(u_lastSelected) < 10.0) {
        color = applyGlass(fragCoord, lastSelectedCenter, 84.0, 10.0, 1.8, color);
    }

    // Apply SIMPLE glass to regular moments
    for (int i = 0; i < 40; i++) {
        if (i >= u_momentsLength) break;
        if (distance(u_moments[i], u_lastSelected) < 0.001) continue;
        float2 momentCenter = u_moments[i] * u_resolution;
        float2 d = fragCoord - momentCenter;
        float dist2 = dot(d, d);
        float maxR = 19.0;
        if (dist2 > maxR*maxR) continue;
        color = applyGlassDotSq(dist2, 18.0, color);
    }

    // Gecko
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    vec2 gecko_uv = uv / u_gecko_scale;
    float s = 1.0 / u_gecko_scale;
    float geckoSDF = buildGeckoSDF(gecko_uv, s);
    float geckoMask = smoothstep(0.0, 0.002, -geckoSDF);
    vec3 geckoColor = endColor * geckoMask;
    color = mix(color, geckoColor, geckoMask);

    return half4(color, geckoMask); // <--- fully transparent background
}
`;






























// BLENDED FINGERS
    // // Fingers
    // float fingerThickness = 0.0025 * s;
    // float fingerRadius = 0.0015 * s;
    // float fingerLineBlend = .0025 * s;
    // float fingerBlend = 0.01 * s;

    // // Front left fingers (0-4)
    // for (int i = 0; i < 5; i++) {
    //     float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[0]) - fingerThickness;
    //     float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
    //     bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
    //     bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    // }

    // // Front right fingers (5-9)
    // for (int i = 5; i < 10; i++) {
    //     float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[1]) - fingerThickness;
    //     float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
    //     bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
    //     bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    // }

    // // Back left fingers (10-14)
    // for (int i = 10; i < 15; i++) {
    //     float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[2]) - fingerThickness;
    //     float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
    //     bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
    //     bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    // }

    // // Back right fingers (15-19)
    // for (int i = 15; i < 20; i++) {
    //     float fingerLine = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[3]) - fingerThickness;
    //     float fingerSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
    //     bodySDF = smoothMin(bodySDF, fingerLine, fingerLineBlend);
    //     bodySDF = smoothMin(bodySDF, fingerSDF, fingerBlend);
    // }
