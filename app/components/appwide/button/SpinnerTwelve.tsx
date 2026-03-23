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

const SpinnerTwelve = ({ color1, color2 }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_time;

float tzb_random(vec2 uv) {
  return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 tzbSoul_expandXY(vec2 uv, vec2 slice, float speed, float delay, float maxScale) {
  float clampedTime = sin((u_time + delay) * speed);
  return (uv - slice) * abs(clampedTime) * maxScale;
}

vec2 truchetPattern(vec2 uv, float index) {
  index = fract((index - 0.5) * 2.0);
  if (index > 0.75) {
    uv = vec2(1.0) - uv;
  } else if (index > 0.5) {
    uv = vec2(1.0 - uv.x, uv.y);
  } else if (index > 0.25) {
    uv = 1.0 - vec2(1.0 - uv.x, uv.y);
  }
  return uv;
}

float tzb_circleOutline(vec2 uv, float outerD, float innerD) {
  return step(length(uv), outerD) - step(length(uv), innerD);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = fragCoord / u_resolution.xy;

  uv.x *= u_resolution.x / u_resolution.y;

  uv *= 25.0;

  uv = tzbSoul_expandXY(uv, vec2(3.0), 0.3, 0.0, 3.0);

  vec2 ipos = floor(uv);
  vec2 fpos = fract(uv);

  vec2 tile = truchetPattern(fpos, tzb_random(ipos));

  float c = 0.0;

  c = tzb_circleOutline(tile, 0.6, 0.5) +
      tzb_circleOutline(tile - vec2(0.5), 0.6, 0.5);

  vec3 color = mix(startColor, endColor, c);

  return half4(color, 1.0);
}
`);

  if (!source) {
    console.error("❌ SpinnerTwelve shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_resolution: [width, height],
  }));

  return (
    <View
      style={{
        flex: 1,
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

export default SpinnerTwelve;