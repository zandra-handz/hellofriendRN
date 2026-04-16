// Step-dots shader. Uses the EXACT same uv -> gecko_uv transform as
// peerDotShader so step targets render in the same space as the peer
// position dot. Only differences: small, solid white, no pulse, no glow.

export const STEP_DOTS_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_gecko_scale;
uniform float  u_gecko_size;
uniform float2 u_step0;
uniform float2 u_step1;
uniform float2 u_step2;
uniform float2 u_step3;

half4 main(float2 fragCoord) {
    // ---- same transform the gecko / peer-dot shader uses ----
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

    // ---- transform each step point into the same gecko_uv space ----
    vec2 p0 = (u_step0 - 0.5) / u_gecko_scale;
    vec2 p1 = (u_step1 - 0.5) / u_gecko_scale;
    vec2 p2 = (u_step2 - 0.5) / u_gecko_scale;
    vec2 p3 = (u_step3 - 0.5) / u_gecko_scale;

    float d0 = length(gecko_uv - p0);
    float d1 = length(gecko_uv - p1);
    float d2 = length(gecko_uv - p2);
    float d3 = length(gecko_uv - p3);
    float d  = min(min(d0, d1), min(d2, d3));

    // small, solid, no pulse, no glow
    float r = 0.010 * s;
    float a = smoothstep(r, r * 0.6, d);

    return half4(half3(a), half(a));
}
`;
