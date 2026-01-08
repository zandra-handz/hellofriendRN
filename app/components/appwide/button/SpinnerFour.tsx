import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader  } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions, View, StyleSheet } from "react-native";
import { useFrameCallback } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// const width = 100;
// const height = 100;

const hexToVec3 = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.replace("#", "");
  // Parse R, G, B as integers
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerFour = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
    const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform vec2 u_resolution;

    float TWO_PI = 6.28318530718;
 
  

 float distFCircle(vec2 uv, float radius, float soul) {
  return length(uv) - radius; 
}

 
float smoothMin(float a, float b, float k) {
  //clamp --> x, minVal, maxVal
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}
 
    
half4 main(vec2 fragCoord) {


     vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});
  
  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

 
    uv = uv - vec2(0.0);

  

   



vec2 circleOneCoords = uv - (vec2(0.5,0.5)-0.5);  // relative to center
vec2 circleTwoCoords = uv - (vec2(0.5,0.5)-0.5);  // relative to center
vec2 circleThreeCoords = uv - (vec2(0.5,0.5)-0.5);  // relative to center

circleOneCoords.x += abs(sin(u_time))*.3;
circleThreeCoords.x += abs(sin(u_time)) *-.3;
    float wave = sin((circleOneCoords.x + u_time *1.) * 5.)*.5 *4.;

  float circleOne = distFCircle(circleOneCoords, .08, 1.);

  vec3 circleOneColor = mix(startColor, endColor, circleOneCoords.x);

  float circleTwo = distFCircle(circleTwoCoords, .08, wave);


      float circleThree = distFCircle(circleThreeCoords, .08, wave);
 
float circleMerge = smoothMin(
    smoothMin(circleOne, circleTwo, 0.05), 
    circleThree, 
    0.05
);

float mask = smoothstep(0.0, 0.002, -circleMerge);  
vec3 finalColor = circleOneColor * mask;
  
return vec4(finalColor, mask);
 
  
 
 
 
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
    <View
      style={{
        // borderWidth: 2,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas
        style={{
          width,
          height,

          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <Rect x={0} y={0} width={width} height={height} color="lightblue">
          <Shader source={source} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 300, height: 300, backgroundColor: "hotpink" },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default SpinnerFour;
