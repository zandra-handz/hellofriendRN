import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LiquidGlassExp = ({prop}) => {
  const [time, setTime] = useState(0);

  // ✅ Create shader safely
  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform vec2 u_resolution;

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      return a + b * cos(6.28318 * (c * t + d));
    }

    half4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / u_resolution * 2.0 - 1.0;
      vec2 uv0 = uv;
      vec3 finalColor = vec3(0.0);

      for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4);
        d = sin(d * 8.0 + u_time) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 2.0);
        finalColor += col * d;
      }

      return vec4(finalColor, 1.0);
    }
  `);

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  // ✅ Simple JS-based animation loop (no Skia hooks)
  const start = useRef(Date.now());
  useEffect(() => {
    let frame;
    const animate = () => {
      const now = (Date.now() - start.current) / 1000; // seconds
      setTime(now);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // ✅ Provide uniforms directly
  const uniforms = {
    u_time: time,
    u_resolution: [300, 300],
  };

  return (
    // <Canvas style={{ flex: 1, width: 300, height: 300 }}>
    //   <Rect x={0} y={0} width={300} height={300}>
        <Canvas style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Rect x={0} y={0} width={width} height={height}>
        <Shader source={source} uniforms={uniforms} />
      </Rect>
    </Canvas>
  );
};

export default LiquidGlassExp;
