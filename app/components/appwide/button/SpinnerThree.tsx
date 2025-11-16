import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions, View, StyleSheet } from "react-native";

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

const SpinnerThree = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
    const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform vec2 u_resolution;

     float TWO_PI = 6.28318530718;

     
    vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});

  

float makeGear(vec2 st, float rotation, float a, float numProngs, float edgeAdd, float dotP){
float shape =  smoothstep(0.0, .6,  (cos(rotation + a * numProngs * 2.))) * .2 + .2;
 
return step(shape, dotP) * (1.0 - step(shape + edgeAdd, dotP));
 


}

    
half4 main(vec2 fragCoord) {
  
  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

 
    uv = uv - vec2(0.0);


      // SETTABLE CONSTANTS
  float numProngs = 6./2.;
  float speed = 14.;
  float rotation = mod(u_time * speed + TWO_PI, TWO_PI); // ADD OR SUBTRACT FROM A/ATWO
  float edgeAdd = 0.05;


  float posH = .11;
  vec2 subOffsetBottom = (uv - vec2(-posH, 0.1)) * 2.0;
  vec2 subOffsetTop = (uv - vec2(posH, -.14)) * 2.0;
 
  float dotP = dot(subOffsetBottom, subOffsetBottom)*4.;
  float a = atan(subOffsetBottom.x, subOffsetBottom.y);

  float dotPTwo = dot(subOffsetTop, subOffsetTop)*4.;
  float aTwo = atan(subOffsetTop.x, subOffsetTop.y);

  // DESIGN SHAPE OF GEARS AND MAKE GEARS
  float gearBottom = makeGear(subOffsetBottom, rotation, a, numProngs, edgeAdd, dotP);
  float gearTop = makeGear(subOffsetTop, -rotation, aTwo, numProngs, edgeAdd, dotPTwo);


     vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});
  vec3 gradient = mix(startColor, endColor, uv.x*uv.y);

  
 
vec3 shapeColored = mix(gradient, gradient, vec3( gearBottom + gearTop));

 return vec4(shapeColored, gearBottom+gearTop);
  
 
 
 
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

export default SpinnerThree;
