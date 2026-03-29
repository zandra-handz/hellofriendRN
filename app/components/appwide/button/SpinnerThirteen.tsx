import React from "react";
import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerThirteen = ({
  size = Math.min(screenWidth, screenHeight) * 0.5,
  speed = 1.0,
  outerColor,
}) => {
  const clock = useClock();

  const outerColorVec = outerColor ? hexToVec3(outerColor) : null;
  const outerColorGLSL = outerColorVec
    ? `vec3(${outerColorVec})`
    : `vec3(0.0)`;
  const outerAlpha = outerColorVec ? `outer` : `0.0`;

  const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;

float TWO_PI = 6.28318530718;

half4 main(vec2 fragCoord) {
  float t = u_time * u_speed;

  vec2 uv = fragCoord / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  vec2 bl = step(vec2(0.1), uv);
  vec2 tr = step(vec2(0.1), 1.0 - uv);
  float outer = bl.x * bl.y * tr.x * tr.y;

  vec2 bl2 = step(vec2(0.2), uv);
  vec2 tr2 = step(vec2(0.2), 1.0 - uv);
  float inner = bl2.x * bl2.y * tr2.x * tr2.y;

  float minSize = 0.194;
  float maxSize = 0.205;
  float animatedSize = minSize + (maxSize - minSize) * abs(sin(t * 2.0));
  vec2 tr3 = step(vec2(animatedSize), 1.0 - uv);
  vec2 bl3 = step(vec2(animatedSize), uv);
  float halo = bl3.x * bl3.y * tr3.x * tr3.y;

  vec3 color = ${outerColorGLSL} * outer;
  float outerAlpha = ${outerAlpha};

  vec3 color2 = vec3(0.8, 0.2, 0.5) * inner;
  float haloMask = halo - inner;
  vec3 color3 = vec3(0.949, 1.0, 0.51) * haloMask;

  vec2 center = vec2(0.5, 0.5);
  float d = distance(uv, center);

  vec2 offset = uv - vec2(0.5);

  float angle = atan(offset.x, offset.y);

  float rotation = mod(t * 6.0, TWO_PI);
  angle = mod(angle - rotation + TWO_PI, TWO_PI);

  float radius = 0.3;
  float thickness = 0.2;

  float arcSize = 5.0 * abs(sin(t * 2.0));

  float radialMask = step(radius - thickness, d) - step(radius, d);
  float edge = 0.1;
  float angularMask = step(0.0, angle) * (1.0 - step(arcSize - edge, angle));

  float mask = radialMask * angularMask;

  float circle = step(d, 0.25);
  vec3 circleColor = vec3(circle);

  float lineThickness = 0.008 * abs(sin(t * 2.0));

  float line = step(0.5 - lineThickness, uv.x) - step(0.5 + lineThickness, uv.x);
  float lineY = step(0.5 - lineThickness, uv.y) - step(0.5 + lineThickness, uv.y);

  vec3 lineColor = vec3(0.0, 1.0, 0.05) * line;
  vec3 lineYColor = vec3(0.0, 1.0, 0.05) * lineY;

  vec3 finalColor = color + color3 + color2 + circleColor + lineColor + lineYColor + (mask * vec3(1.0, 0.0, 1.0));

  float alpha = max(outerAlpha, max(inner, max(haloMask, max(circle, max(mask, max(line, lineY))))));

  return vec4(finalColor * alpha, alpha);
}
`);

  if (!source) {
    console.error("❌ SpinnerThirteen shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_resolution: [size, size],
    u_speed: speed,
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas style={{ width: size, height: size }}>
        <Rect x={0} y={0} width={size} height={size}>
          <Shader source={source} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </View>
  );
};

export default SpinnerThirteen;