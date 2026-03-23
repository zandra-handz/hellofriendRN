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

const SpinnerEight = ({ color1, color2 }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_time;

float PI = 3.14159265359;

vec2 brickTile(vec2 uv, float zoom, float row, float column) {
  uv *= zoom;

  float period = 2.;
  float activeTime = 1.;

  float moving = step(0.0, mod(u_time, period) - (period - activeTime));
  float paused = 1.0 - moving;
  float speed = 3.;

  uv.x += step(1., mod(uv.y, 1.0)) * 0.5;

  float rowMod = mod(row, 2.);
  float columnMod = mod(column, 2.);

  float direction = rowMod * 2.0 - 1.0;
  float yDirection = columnMod * 2.0 - 1.0;

  uv.x += direction * fract(u_time * speed) * moving;
  uv.y += yDirection * fract(u_time * speed) * paused;

  return fract(uv);
}

float circle(vec2 uv, float radius) {
  uv -= vec2(0.5);
  uv.x *= u_resolution.x / u_resolution.y;
  float len = length(uv);
  return smoothstep(radius, radius - 1e-4, len);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = fragCoord / u_resolution.xy;

  float zoom = 10.;
  float innerSize = .17;

  float rowIndex = floor(uv.y * zoom);
  float columnIndex = floor(uv.x * zoom);
  uv = brickTile(uv, zoom, rowIndex, columnIndex);

  float c = circle(uv, innerSize);

  vec3 color = mix(startColor, endColor, c);

  return half4(color, 1.0);
}
`);

  if (!source) {
    console.error("❌ SpinnerSeven shader failed to compile");
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

export default SpinnerEight;