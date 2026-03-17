import React from "react";
import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const CANVAS_SIZE = 150;

const SpinnerFiveMini = ({ color1, color2, size = CANVAS_SIZE }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
mat2 tzb_rotate2dSimple(float speed, float u_time){
  float soul = u_time * speed;
  return mat2(cos(soul), -sin(soul),
              sin(soul),  cos(soul));
}

uniform vec2 u_resolution;
uniform float u_time;

float distFCircle(vec2 uv, float radius) {
  return length(uv) - radius;
}

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + (0.5*(b - a)/k), 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0 - h);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 center = 0.5 * u_resolution;
  float boxSize = u_resolution.y * 0.5;
  if (abs(fragCoord.x - center.x) > boxSize || abs(fragCoord.y - center.y) > boxSize) {
    return vec4(0.0);
  }

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;
  uv = tzb_rotate2dSimple(6., u_time) * uv;

  float scale = 2.0;
  uv *= scale;

  float regroupSpeed = .14;
  float speed = 3.0;
  float circleSize = .05;
  float centerCircleSize = .07;

  vec2 circleOneCoords   = uv;
  vec2 circleTwoCoords   = uv;
  vec2 circleThreeCoords = uv;
  vec2 circleFourCoords  = uv;
  vec2 circleFiveCoords  = uv;

  circleTwoCoords.x   += abs(sin(u_time * speed)) * regroupSpeed;
  circleThreeCoords.x += abs(sin(u_time * speed)) * -regroupSpeed;
  circleFourCoords.y  += abs(sin(u_time * speed)) * regroupSpeed;
  circleFiveCoords.y  += abs(sin(u_time * speed)) * -regroupSpeed;

  vec3 circleTwoColor = mix(startColor, endColor, circleTwoCoords.x / scale);

  float circleOne   = distFCircle(circleOneCoords,   centerCircleSize);
  float circleTwo   = distFCircle(circleTwoCoords,   circleSize);
  float circleThree = distFCircle(circleThreeCoords, circleSize);
  float circleFour  = distFCircle(circleFourCoords,  circleSize);
  float circleFive  = distFCircle(circleFiveCoords,  circleSize);

  float circleMerge = smoothMin(
    smoothMin(circleOne, circleTwo, 0.05),
    circleThree,
    0.05
  );
  circleMerge = smoothMin(
    smoothMin(circleMerge, circleFour, 0.05),
    circleFive,
    0.05
  );

  float mask = smoothstep(0.0, 0.002, -circleMerge);
  vec3 finalColor = circleTwoColor * mask;
  return vec4(finalColor, mask);
}
`);

  if (!source) {
    console.error("❌ SpinnerFiveMini shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_resolution: [size, size],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Rect x={0} y={0} width={size} height={size}>
          <Shader source={source} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </View>
  );
};

export default SpinnerFiveMini;