// Peer-dot shader. Mirrors the same uv -> gecko_uv transform the gecko shader
// uses, so a dot drawn here lands exactly where the peer's gecko head would
// render. The incoming u_peerPoint is in the same "pointer-scaled" space as
// leadPoint.current.lead (what the sender transmits), and we apply the same
// (p - 0.5) / gecko_scale conversion that packGeckoOnlyProdCompact_56 applies
// to all gecko points before the shader sees them.

export const PEER_DOT_SKSL = `
uniform float2 u_resolution;
uniform float  u_aspect;
uniform float  u_gecko_scale;
uniform float  u_gecko_size;
uniform float  u_time;
uniform float2 u_peerPoint; // pointer-scaled space (raw leadPoint.lead)

half4 main(float2 fragCoord) {
    // ---- same transform the gecko shader uses ----
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;
    float s = 1.0 / u_gecko_scale;
    vec2 gecko_uv = uv * s * u_gecko_size;

    // ---- transform peer point into the same gecko_uv space ----
    // matches packGeckoOnlyProdCompact_56's per-point conversion:
    //   out = (p - 0.5) / gecko_scale
    vec2 peer_gecko = (u_peerPoint - 0.5) / u_gecko_scale;

    float d = length(gecko_uv - peer_gecko);

    // pulse for a little life
    float pulseSpeed  = 2.5;
    float pulseAmount = 0.15;
    float outerPulse  = 1.0 + pulseAmount * sin(u_time * pulseSpeed);
    float middlePulse = 1.0 + pulseAmount * 0.5 * sin(u_time * pulseSpeed + 1.0);
    float corePulse   = 1.0 + pulseAmount * 0.3 * sin(u_time * pulseSpeed + 2.0);

    // radii in gecko_uv space (same scale gecko parts use, e.g. 0.005 * s)
    float outerR  = 0.030 * s * outerPulse;
    float middleR = 0.016 * s * middlePulse;
    float coreR   = 0.011 * s * corePulse;

    float outerGlow  = smoothstep(outerR, 0.0, d) * 0.45;
    float middleRing = smoothstep(middleR, middleR * 0.70, d) * 0.70;
    float coreDot    = smoothstep(coreR, 0.0, d) * 1.00;

    float intensity = clamp(outerGlow + middleRing + coreDot, 0.0, 1.0);
    return half4(half3(intensity), half(intensity));
}
`;
