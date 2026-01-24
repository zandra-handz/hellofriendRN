export const MOMENTS_BG_SKSL_OPT = `

uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_scale;
uniform float u_gecko_scale;
uniform float2 u_moments[40];
uniform int    u_momentsLength;

uniform float2 u_selected;
uniform float2 u_lastSelected;


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


   
        color = applyGlassDotSq(dist2, 3.0, color);

   
    }
    

 
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
 uv.x *= u_aspect;
//  uv /= u_scale;
    vec2 scaled_uv = uv / u_scale; 
 
    float selectedMask = step(distance(uv, u_selected), 0.008);
    vec3 selectedColor = endColor * selectedMask; 
 
    color = mix(color, selectedColor, selectedMask);
    return half4(color, 1.0);
}

`;
