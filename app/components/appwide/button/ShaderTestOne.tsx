import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.replace("#", "");
  // Parse R, G, B as integers
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const ShaderTestOne = ({ color1, color2 }) => {
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const [time, setTime] = useState(0);

  const source = Skia.RuntimeEffect.Make(`
 

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
    return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453123);
}

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

mat2 scale(vec2 scale) {
  return mat2(scale.x, 0., 0., scale.y);
}

   half4 main(vec2 fragCoord) {
   vec2 uv = fragCoord / u_resolution * 2.0 - 1.0;
   uv.x *= u_resolution.x / u_resolution.y; 
  uv -= vec2(0.5);
  uv *= rotate(sin(u_time *0.1) * 5.);
  uv *= scale(vec2(sin(u_time * 1.0) * 8.));
  uv -= vec2(0.5);

  float scaleFactor = abs(sin(u_time * 1.0)); 
  float squaresAcross = 9.;
  float checkerX = floor(uv.x * squaresAcross);
  float squaresVertically = 9.;
  float checkerY = floor(uv.y * squaresVertically);

  vec3 checker = vec3(mod(checkerX + checkerY, 2.0));

  vec3 color1 = vec3(${color1Converted});
  vec3 color2 = vec3(${color2Converted});

  float checkerValue = mod(checkerX + checkerY, 2.0);
  float phase = hash(vec2(checkerX, checkerY)) * 3.14159 * 2.0;
  float swap = abs(sin(u_time * 2.0 + phase));
  float factor = checkerValue == 0.0 ? swap : 1.0 - swap;
  vec3 checkerColor = mix(color1, color2, factor);

  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 finalColor = mix(checkerColor, red, smoothstep(0.95, 1.0, 1. - scaleFactor));

  return vec4(finalColor, 1.);
}

  `);

  if (!source) {
    console.error("❌ Shader failed to compile");
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
    <Canvas
      style={{ width, height, alignItems: "center", justifyContent: "center" }}
    >
      <Rect x={0} y={0} width={width} height={height}>
        <Shader source={source} uniforms={uniforms} />
      </Rect>
    </Canvas>
  );
};

export default ShaderTestOne;
