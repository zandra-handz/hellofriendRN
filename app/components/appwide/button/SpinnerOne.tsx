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


const SpinnerOne = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);


  
 const source = Skia.RuntimeEffect.Make(`
float tzb_circleTrueSDF(vec2 _uv, float r){
  return length(_uv) - r; // the distance minus the circle cut off
}
 
float tzb_sMin(float a, float b, float k){
  float h = clamp(.5 + (.5*(b-a/k)), 0., 1. );
                      // creates parabolic curve
  return mix(b, a, h) - k*h*(1. - h);   // 1. - value inverts the value


}

vec3 tzb_sMinMask(float _tzb_sMin, vec3 _color){
  float mask = smoothstep(.0,.002, _tzb_sMin);
  return mask * _color;

} 
vec2 tzb_zeroZeroCenter(vec2 uv) {
  return uv -= .5;
}
 
 
vec2 tzb_select(vec2 _uv, vec2 _slice){
  return _uv -= _slice;
}

vec2 tzb_deselect(vec2 _uv, vec2 _slice){
  return _uv += _slice;
}

 

// must multiply with coords
mat2 tzb_rotate2d(float angle){
  return mat2(cos(angle), -sin(angle),
              sin(angle),  cos(angle));
}
 
 vec3 tzb_radialGradient(float circleDF, vec3 colorOne, vec3 colorTwo, float radius){
  float mask = smoothstep(radius, .0, circleDF);
  return mix(colorOne, colorTwo, mask);
}

uniform vec2 u_resolution;
uniform float u_time;

float PI = 3.14159265359;
float TWO_PI = 6.28318530718;
 
half4 main(vec2 fragCoord) {
    vec3 startColor = vec3(${color1Converted});
    vec3 endColor   = vec3(${color2Converted});

   vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

 
 
  float t1 = sin(u_time*4.); // slower oscillation
  float t2 = cos(u_time*4.); // faster oscillation
  float t3 = sin(u_time*4.); // faster oscillation


  float circleOneSize = .04;
  float circleTwoSize = .04;
  float circleThreeSize = .03;

  vec2 circleOneSlice = vec2(.1,.1);
  vec2 circleTwoSlice = vec2(.1,.1);
  vec2 circleThreeSlice = vec2(.1,.1);


  float smoothFactorOneTwo = .02;
  float smoothFactorThree = .03;
  

  uv = tzb_rotate2d(u_time * 9.0 + t1) * uv;
  vec2 uvTwo = tzb_rotate2d( .1 + t3) * uv;
  vec2 uvThree = tzb_rotate2d( 1. + t2) * uvTwo;
 

// for RNSkia
float scale = 4; // smaller shapes
uv *= scale;
uvTwo *= scale;
uvThree *= scale;
// end RNSkia

  vec2 uvCircleOne = tzb_select(uv, circleOneSlice);
  vec2 uvCircleTwo = tzb_select(uvTwo,circleTwoSlice);
  vec2 uvCircleThree = tzb_select(uvThree, circleThreeSlice);
 
  
  float circle = tzb_circleTrueSDF(uvCircleOne, circleOneSize);
  float circleTwo = tzb_circleTrueSDF(uvCircleTwo, circleTwoSize);
  float circleThree = tzb_circleTrueSDF(uvCircleThree, circleThreeSize);

  vec3 circleOneColor = tzb_radialGradient(circleThree, startColor, startColor, .5);

  
  float merged = tzb_sMin(tzb_sMin(circle, circleTwo, smoothFactorOneTwo), circleThree, smoothFactorThree);
  vec3 mask = tzb_sMinMask(-merged, circleOneColor);

float alpha = smoothstep(0.0, 0.002, -merged); // alpha based on merged SDF
vec3 color = tzb_sMinMask(-merged, circleOneColor); // RGB only

return vec4(color, alpha);
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

  {color1Converted && color2Converted && (
    

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
        )}
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

export default SpinnerOne;
