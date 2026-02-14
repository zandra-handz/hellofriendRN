export const MOMENTS_BG_SKSL_OPT = `

uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;
uniform float2 u_walk0;
uniform float u_time;
uniform float u_gecko_scale;
uniform float u_gecko_size;
uniform float2 u_moments[40];
uniform float2 u_heldMoments[4];

uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;
// uniform float2 u_holding0;


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
 







// ------------------------------------------------
// Background sampling
// ------------------------------------------------

// float3 sampleBackground(float2 fragCoord) {
//     float2 uv = fragCoord / u_resolution;
//     uv -= 0.5;
//     uv.x *= u_aspect;
//     uv /= u_scale;

//     float pixelY = uv.y * u_resolution.y;
//     float stripe = step(1.0, mod(pixelY / 20.0, 2.0));

//     float t = clamp(uv.y + 0.5, 0.0, 1.0);
//     float3 grad = mix(backgroundStartColor, backgroundEndColor, t);


//     return mix(grad, grad * 0.6, stripe);
// }




// ------------------------------------------------
// Background sampling - NO STRIPES
// ------------------------------------------------

float3 sampleBackground(float2 fragCoord) {
    float2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    uv /= u_scale;

    // Simple vertical gradient without stripes
    float t = clamp(uv.y + 0.5, 0.0, 1.0);
   float3 grad = mix(backgroundStartColor, backgroundEndColor, t);

    return grad;
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
    float baseHeight = thickness * 30.0; // 10 for stripes
    float2 size = float2(2.0);

    float sd = sdfRect(centerPx, size, fragCoord , radius);
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

  

float3 applyGlowingHeldMoment(float2 fragCoord, float2 heldPx, float3 baseColor) {
    float d = length(fragCoord - heldPx);

    float pulseSpeed  = 2.5;
    float pulseAmount = 0.15;

    float outerPulse = 1.0 + pulseAmount * sin(u_time * pulseSpeed);
    float middlePulse = 1.0 + pulseAmount * 0.5 * sin(u_time * pulseSpeed + 1.0);
    float corePulse = 1.0 + pulseAmount * 0.3 * sin(u_time * pulseSpeed + 2.0);

    // Pixel radii
    float outerR  = 21.0 * outerPulse;
    float middleR = 11.0 * middlePulse;
    float coreR   =  8.0 * corePulse;

    float outerGlow = smoothstep(outerR, 0.0, d) * 0.45;
    float middleRing = smoothstep(middleR, middleR * 0.70, d) * 0.70;
    float coreDot = smoothstep(coreR, 0.0, d) * 1.00;

    // Add light directly (no endColor)
    float intensity = outerGlow + middleRing + coreDot;
    return baseColor + float3(intensity);
}





// ------------------------------------------------
// MAIN
// ------------------------------------------------

half4 main(float2 fragCoord) { 
    float3 baseBackground = sampleBackground(fragCoord);
    float3 color = baseBackground;

    

 
    vec2 uv = fragCoord / u_resolution;
//   uv -= 0.5;
//   uv.x *= u_aspect;
//    uv /= u_scale;
 
 

    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

   // vec2 scaled_uv = uv / u_scale; 


    float selectedMask = step(distance(uv, u_selected), 0.02);
    vec3 selectedColor = endColor * selectedMask; 


    // Convert selected to pixel space (same as moments)
float2 selectedPx = u_selected * u_resolution;
float2 d = fragCoord - selectedPx;
float dist2 = dot(d, d);
float maxR = 19.0; // radius + edge
if (dist2 < maxR * maxR) {
    color = applyGlassDotSq(dist2, 60.0, color);
}

// DON'T DELETE: USED DENORMALIZED FOR USER POINTER
    // float2 deNormalizedLastSelectedCenter = u_lastSelected * u_resolution;
    // // if (length(u_lastSelected) < 10.0) { // Adjust threshold as needed

    // if (length(u_lastSelected) > 0.0001) {

    //     color = applyGlass(
    //         fragCoord,
    //         deNormalizedLastSelectedCenter,
    //         34.0,      // radius
    //         10.0,      // thickness
    //         1.8,       // ior
    //         color
    //     );
    // }
    
    
// Remove this pixel conversion for mapping onto gecko
// float2 deNormalizedLastSelectedCenter = u_lastSelected * u_resolution;

// Instead, convert to same space as gecko
vec2 lastSelected_uv = u_lastSelected;


// IF MAPPING ONTO GECKO (FOR USER POINTER USE ABOVE CODE INSTEAD)
// Now convert from gecko space to pixel space for applyGlass
// Reverse the gecko_uv transformation
vec2 lastSelected_screen = lastSelected_uv / (s * u_gecko_size);
lastSelected_screen.x /= u_aspect;
lastSelected_screen += 0.5;
float2 lastSelected_px = lastSelected_screen * u_resolution;

if (length(u_lastSelected) > 0.0001) {
    color = applyGlass(
        fragCoord,
        lastSelected_px,  // Now in correct pixel space
        34.0,
        10.0,
        1.8,
        color
    );
}


// for (int i = 0; i < 4; i++) {
//     vec2 holding_uv = u_heldMoments[i];
    
//     vec2 holding_screen = holding_uv / (s * u_gecko_size);
//     holding_screen.x /= u_aspect;
//     holding_screen += 0.5;
//     float2 holding_px = holding_screen * u_resolution;
    
//     if (length(u_heldMoments[i]) > 0.0001) {
//         color = applyGlass(
//             fragCoord,
//             holding_px,
//             10.0,
//             10.0,
//             1.8,
//             color
//         );
//     }
// }

for (int i = 0; i < 4; i++) {
    vec2 holding_uv = u_heldMoments[i];
 
    // If your "empty" slots are (-100,-100), this is the correct skip.
    if (abs(holding_uv.x) > 50.0 || abs(holding_uv.y) > 50.0) continue;
 
    vec2 holding_screen = holding_uv / (s * u_gecko_size);
    holding_screen.x /= u_aspect;
    holding_screen += 0.5;
    float2 holding_px = holding_screen * u_resolution;
 
    color = applyGlowingHeldMoment(fragCoord, holding_px, color);
}

// // ------------------------------------------------
// //  SIMPLIFIED: Static glowing held moments (in gecko space)
// // ------------------------------------------------
// for (int i = 0; i < 4; i++) {
//     vec2 heldPos = u_heldMoments[i];
    
//     // Skip if invalid position (-100, -100)
//     if (abs(heldPos.x) > 50.0 || abs(heldPos.y) > 50.0) {
//         continue;
//     }
    
//     vec3 glowColor = endColor;
//     float dist = length(gecko_uv - heldPos);
    
//     // Simple three-layer glow (no pulsing)
//     // Outer glow
//     float outerGlow = smoothstep(0.025, 0.0, dist);
//     vec3 outerLayer = glowColor * outerGlow * 0.4;
    
//     // Middle ring
//     float middleGlow = smoothstep(0.015, 0.010, dist);
//     vec3 middleLayer = glowColor * middleGlow * 0.6;
    
//     // Core dot
//     float coreGlow = smoothstep(0.008, 0.0, dist);
//     vec3 coreLayer = glowColor * coreGlow;
    
//     // Add all layers to color
//     color = color + outerLayer + middleLayer + coreLayer;
// }

// vec2 holding0_uv = u_holding0;

// vec2 holding0_screen = holding0_uv / (s * u_gecko_size);
// holding0_screen.x /= u_aspect;
// holding0_screen += 0.5;
// float2 holding0_px = holding0_screen * u_resolution;

// if (length(u_holding0) > 0.0001) {
//     color = applyGlass(
//         fragCoord,
//         holding0_px,  // Now in correct pixel space
//         34.0,
//         10.0,
//         1.8,
//         color
//     );
// }

// u_walk0 dot (separate from holdings and moments)
// vec2 walk0_uv = u_walk0;

// vec2 walk0_screen = walk0_uv / (s * u_gecko_size);
// walk0_screen.x /= u_aspect;
// walk0_screen += 0.5;
// float2 walk0_px = walk0_screen * u_resolution;

// if (length(u_walk0) > 0.0001) {
//     color = applyGlass(
//         fragCoord,
//         walk0_px,
//         20.0,
//         10.0,
//         1.8,
//         color
//     );
// }


        for (int i = 0; i < 40; i++) {
        if (i >= u_momentsLength) break;
         
        if (distance(u_moments[i], u_lastSelected) < 0.001) continue;
        
        float2 deNormalizedCenter = u_moments[i] * u_resolution;
        float2 d = fragCoord - deNormalizedCenter;
        float dist2 = dot(d, d);
        float maxR = 19.0; // radius + edge
        if (dist2 > maxR * maxR) continue;
   
        color = applyGlassDotSq(dist2, 7.0, color);
    }

    

 
    // color = mix(color, selectedColor, selectedMask);
    return half4(color, 1.0);
}

`;
