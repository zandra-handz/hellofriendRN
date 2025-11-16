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

const SpinnerTwo = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
    const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform vec2 u_resolution;

     float TWO_PI = 6.28318530718;

     
    vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});

  

float rotatingMotion(float speed){ 
  return mod(u_time * speed + TWO_PI, TWO_PI);

}
 
float rotateThetaClock(float theta, float speed) { 
  return mod(theta - rotatingMotion(speed) + TWO_PI, TWO_PI);
}
  

float rotateThetaCounter(float theta, float speed) {
  return mod(theta + rotatingMotion(speed) + TWO_PI, TWO_PI);
}


float straightPlotAnywhere( float offset, float width, float axis) {
  float newCoord = abs(axis - offset);
  return step(newCoord - width, newCoord) - step(width, newCoord);
}


float smoothPlotAnywhere( float offset, float width, float axis) {
  float newCoord = abs(axis - offset);
  return smoothstep(offset - width, offset, axis) -
        smoothstep(offset, offset + width, axis);
}

    vec3 multiColoredCircle(vec2 uv, float radius) {

      vec2 centerOfCircle = uv - vec2(0.0);
      float theta = atan(centerOfCircle.x, centerOfCircle.y); 
    float len = dot(centerOfCircle, centerOfCircle) * 4.0;
     vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});
      float thickness = .01; 
      float spinnerSpeed = 6.; 

    float arcLength = 2.4; 
      float clockHand = smoothPlotAnywhere(arcLength, arcLength, rotateThetaClock(theta, spinnerSpeed));
      float anglePiece = straightPlotAnywhere(radius, thickness, len);
      vec3 colored = mix(endColor, startColor, clockHand);
      return colored * anglePiece;
    }


    vec3 multiColoredCircleCounter(vec2 uv, float radius) {
      
      vec2 centerOfCircle = uv - vec2(0.0);
      float theta = atan(centerOfCircle.x, centerOfCircle.y); 
      float len = dot(centerOfCircle, centerOfCircle) * 4.0;
      vec3 startColor = vec3(${color1Converted});
      vec3 endColor = vec3(${color2Converted});

    
      float thickness = .01; 
      float spinnerSpeed = 6.;
      float arcLength = 2.4;
    
      float clockHand = smoothPlotAnywhere(arcLength, arcLength, rotateThetaCounter(theta, spinnerSpeed));

      float anglePiece = straightPlotAnywhere(radius, thickness, len);
    vec3 colored = mix(endColor, startColor, clockHand);

      return colored * anglePiece;
    }
 

    
half4 main(vec2 fragCoord) {
  
  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

 
    vec2 offset = uv - vec2(0.0);
  
    vec3 circle = vec3( 
    multiColoredCircleCounter(uv, .05) 
     + multiColoredCircle(uv, .03)  
    );

 return vec4(circle, circle.r); 
 
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

export default SpinnerTwo;
