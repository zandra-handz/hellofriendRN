import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions, View, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerFive = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
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

  // RNSkia-style UV centering (matches SpinnerOne pattern)
  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  // scale to match original shader visual size
  float scale = 4.0;
  uv *= scale;

  uv = tzb_rotate2dSimple(6., u_time) * uv;

  float regroupSpeed = .14;
  float speed = 2.6;
  float circleSize = .05 * scale;
  float centerCircleSize = .07 * scale;

  vec2 circleOneCoords   = uv;
  vec2 circleTwoCoords   = uv;
  vec2 circleThreeCoords = uv;
  vec2 circleFourCoords  = uv;
  vec2 circleFiveCoords  = uv;

  circleTwoCoords.x   += abs(sin(u_time * speed)) * regroupSpeed * scale;
  circleThreeCoords.x += abs(sin(u_time * speed)) * -regroupSpeed * scale;
  circleFourCoords.y  += abs(sin(u_time * speed)) * regroupSpeed * scale;
  circleFiveCoords.y  += abs(sin(u_time * speed)) * -regroupSpeed * scale;

  float circleOne   = distFCircle(circleOneCoords,   centerCircleSize);
  float circleTwo   = distFCircle(circleTwoCoords,   circleSize);
  float circleThree = distFCircle(circleThreeCoords, circleSize);
  float circleFour  = distFCircle(circleFourCoords,  circleSize);
  float circleFive  = distFCircle(circleFiveCoords,  circleSize);

  vec3 circleTwoColor = mix(startColor, endColor, circleTwoCoords.x);

  float circleMerge = smoothMin(
    smoothMin(circleOne, circleTwo, 0.05 * scale),
    circleThree,
    0.05 * scale
  );
  circleMerge = smoothMin(
    smoothMin(circleMerge, circleFour, 0.05 * scale),
    circleFive,
    0.05 * scale
  );

  float mask = smoothstep(0.0, 0.002 * scale, -circleMerge);
  vec3 finalColor = circleTwoColor * mask;
  return vec4(finalColor, mask);
}
`);

  if (!source) {
    console.error("❌ SpinnerFive shader failed to compile");
    return null;
  }

  const start = useRef(Date.now());
  useEffect(() => {
    let frame;
    const animate = () => {
      const now = (Date.now() - start.current) / 1000;
      setTime(now);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const uniforms = {
    u_time: time,
    u_resolution: [width, height],
  };

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
          <Rect x={0} y={0} width={width} height={height} color="transparent">
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
};

export default SpinnerFive;