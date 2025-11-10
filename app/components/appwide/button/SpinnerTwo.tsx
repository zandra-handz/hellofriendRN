import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions, View, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// const width = 100;
// const height = 100;

const SpinnerTwo = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform vec2 u_resolution;
 

    
half4 main(vec2 fragCoord) {
  // Normalize pixel coords to range [-1, 1], centered on screen
  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

 
    vec2 offset = uv - vec2(0.0);
    float TWO_PI = 6.28318530718;
   
    float d2 = length(offset);
  
    float angle = (atan(offset.y, offset.x)); 
    float speed = 6.0;        
    float rotation = mod(u_time * speed, TWO_PI);
    angle = mod(angle - rotation + TWO_PI, TWO_PI); //NUMBER MUST BE TWO_PI SPECIFICALLY. The masking logic expects angles in [0, 2π] for a full circle.  
    float radius = 0.03;
    float thickness = 0.005;
    float ringThickness = smoothstep(radius - thickness, radius, d2) 
                     - smoothstep(radius, radius + thickness, d2);
    float arcSize = 5. *  abs(sin(u_time * 2.0)); 

    float t =  arcSize; // 0 at start, 1 at end
    vec3 angularColor = mix(vec3(1.0,0.0,0.0), vec3(0.0,1.0,0.0), arcSize / 5.3);
    float radialMask = smoothstep(radius - thickness, radius, d2)
                    - smoothstep(radius, radius + thickness, d2);
    float edge = 0.1; //  arc ends
    float angularMask = smoothstep(0.0, edge, angle) * (1.0 - smoothstep(arcSize - edge, arcSize, angle));
     
    float mask = radialMask * angularMask;
    return vec4(angularColor * mask, mask);

 
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
  container: { width: 300, height: 300, backgroundColor: 'hotpink' },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default SpinnerTwo;
