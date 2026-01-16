export const BG_STRIPES_GLSL = `
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_aspect;

vec4 main(vec2 fragCoord) {
    // Normalize
    vec2 uv = fragCoord / u_resolution;

    // Apply your global transforms ONCE
    uv -= vec2(0.5);
    uv.x *= u_aspect;
    uv.x /= u_scale;

    // Convert to pixel space for stripes
    float pixelY = uv.y * u_resolution.y;

    vec3 color;
    if (mod(pixelY / 20.0, 2.0) < 1.0) {
        color = vec3(0.0, 0.5, 1.0);
    } else {
        color = vec3(0.9);
    }

    return vec4(color, 1.0);
}
`;

export const BG_GRADIENT_GLSL = `
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_aspect;
 

vec4 main(vec2 fragCoord) {
    // Normalize
    vec2 uv = fragCoord / u_resolution;

    // Apply your global transforms ONCE (IDENTICAL TO STRIPES)
    uv -= vec2(0.5);
    uv.x *= u_aspect;
    uv.x /= u_scale;

    // Use THE SAME SPACE as stripes
    // uv.y is already normalized & centered
    float t = clamp(uv.y + 0.5, 0.0, 1.0);

    vec3 color = mix(startColor, endColor, t);
    return vec4(color, 1.0);
}
`;

export const BG_GRADIENT_STRIPES_GLSL = `
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_aspect; 

vec4 main(vec2 fragCoord) {
    // Normalize
    vec2 uv = fragCoord / u_resolution;

    // Apply your global transforms ONCE
    uv -= vec2(0.5);
    uv.x *= u_aspect;
    uv.x /= u_scale;

    // Stripe mask (IDENTICAL to BG_STRIPES_GLSL)
    float pixelY = uv.y * u_resolution.y;
    float stripe = step(1.0, mod(pixelY / 20.0, 2.0));
    // stripe == 0 or 1

    // Gradient in the SAME space
    float t = clamp(uv.y + 0.5, 0.0, 1.0);
    vec3 gradColor = mix(startColor, endColor, t);

    // Two stripe tones with stronger contrast
    vec3 colorA = gradColor;           // Base stripe
    vec3 colorB = gradColor * 0.6;     // Darker stripe for more contrast

    vec3 color = mix(colorA, colorB, stripe);

    return vec4(color, 1.0);
}
`;
