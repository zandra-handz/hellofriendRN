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

const SpinnerSeven = ({ color1, color2 }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
mat2 tzb_rotate2d(float angle){
  return mat2(cos(angle), -sin(angle),
              sin(angle),  cos(angle));
}

mat2 tzb_rotate2dSimple(float speed, float u_time){
  float soul = u_time * speed;
  return mat2(cos(soul), -sin(soul),
              sin(soul),  cos(soul));
}

uniform vec2 u_resolution;
uniform float u_time;

float PI = 3.14159265359;

float circleDF(vec2 uv, float radius){
  return length(uv) - radius;
}

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 - 0.5*(a-b)/k, 0., 1.);
  return mix(b, a, h) - k*h*(1. - h);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  // for RNSkia
  float scale = 2.0;
  uv *= scale;
  // end RNSkia

  float dotP = dot(uv, uv) * 4.;
  float len = length(uv);

  float circleSize = 0.1;
  float speed = 3.0;
  int circleCount = 3;
  float spacing = 0.85;

  float total = 1e5;

  for(int i = 0; i < 10; i++) {
    if(i >= circleCount) break;

    float phase = float(i) * 0.6;
    float xOffset = sin(u_time * speed - phase) * -0.5;
    float wrappedX = fract(uv.x / spacing - xOffset) * spacing - spacing * 0.5;

    vec2 circleUV = vec2(wrappedX, uv.y);
    float d = circleDF(circleUV, circleSize);
    total = smoothMin(total, d, 0.05);
  }

  float mask = smoothstep(0.0, 0.002, -total);
  vec3 finalColor = mix(startColor, endColor, uv.x / scale);
  return vec4(finalColor * mask, mask);
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
          <Rect x={0} y={0} width={width} height={height} color="lightblue">
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
};

export default SpinnerSeven;