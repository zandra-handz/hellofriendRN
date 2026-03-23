import React from "react";
import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerThirteen = ({ color1, color2 }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 uv, float radius) {
  uv -= vec2(0.5);
  float len = length(uv);
  return smoothstep(radius, radius - 1e-4, len);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  float zoom = 60.;

  float angle = u_time * 3.0;
  mat2 rot = mat2(cos(angle), -sin(angle),
                  sin(angle),  cos(angle));
  uv = rot * uv;

  vec2 tileUV = fract(uv * zoom);

  float c = circle(tileUV, 0.15);

  vec3 color = mix(startColor, endColor, c);

  return half4(color, 1.0);
}
`);

  if (!source) {
    console.error("❌ SpinnerTen shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_resolution: [width, height],
  }));

  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {color1Converted && color2Converted && (
        <Canvas style={{ width, height }}>
          <Rect x={0} y={0} width={width} height={height}>
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
};

export default SpinnerThirteen;