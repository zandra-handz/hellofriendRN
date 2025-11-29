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

const SpinnerGeckoToes = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
    const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
   
float tzb_lineSegmentSDF(vec2 uv, vec2 start, vec2 end, float r){
  float h = min(1., max(0., dot(uv-start, end-start)/dot(end-start, end-start) ));
  return length(uv-start-(end-start)*h)-r;

}
 
vec2 tzb_jointCoords(float theta, float r){
  return vec2(cos(theta), sin(theta))*r;

;}
  
float tzb_circleTrueSDF(vec2 _uv, float r){
  return length(_uv) - r; // the distance minus the circle cut off
}
 
 
vec2 tzb_select(vec2 _uv, vec2 _slice){
  return _uv -= _slice;
}

vec2 tzb_deselect(vec2 _uv, vec2 _slice){
  return _uv += _slice;
}
 
 
 
float gecko_lineSegmentSDF(vec2 uv, vec2 start, vec2 end, float r){
  float h = min(1., max(0., dot(uv-start, end-start)/dot(end-start, end-start) ));
  return length(uv-start-(end-start)*h)-r;

}
 
vec2 gecko_jointCoords(float theta, float r){
  return vec2(cos(theta), sin(theta))*r;

}
  
float gecko_circleTrueSDF(vec2 _uv, float r){
  return length(_uv) - r; 
}




float geckoHand(vec2 uv, float toeRange, float toeLength, float radius, float circleSize){    // float toeRange = PI - .1;
 
  float a = atan(uv.x,uv.y); 
 

  vec2 palmJoint = gecko_jointCoords(a, 0.);
  vec2 t1Joint = gecko_jointCoords(toeRange *-.2, toeLength);
  vec2 t2Joint = gecko_jointCoords(toeRange  *-.4, toeLength);
  vec2 t3Joint = gecko_jointCoords(toeRange   *-.6, toeLength);
  vec2 t4Joint = gecko_jointCoords(toeRange   * -.8, toeLength);
  vec2 t5Joint = gecko_jointCoords(toeRange *-1., toeLength); 

  float tL1 = gecko_lineSegmentSDF(uv, palmJoint, t1Joint, radius) ;
  float tL2 = gecko_lineSegmentSDF(uv, palmJoint, t2Joint, radius);
  float tL3 = gecko_lineSegmentSDF(uv, palmJoint, t3Joint, radius);
  float tL4 = gecko_lineSegmentSDF(uv, palmJoint, t4Joint, radius);
  float tL5 = gecko_lineSegmentSDF(uv, palmJoint, t5Joint, radius); 


  float lineDist = .01;

  tL1 = 1. - step(lineDist, tL1);
  tL2 = 1. - step(lineDist, tL2);
  tL3 = 1. - step(lineDist, tL3);
  tL4 = 1. - step(lineDist, tL4);
  tL5 = 1. - step(lineDist, tL5); 
 
  float toes = max(max(max(tL1, tL2), max(tL3, tL4)), tL5);
  
  float circle = 1.0 - step(circleSize + .01, gecko_circleTrueSDF(uv, circleSize));

  return max(circle, toes);

}


 
vec2 tzb_zoom(vec2 uv, float zoom) {
  return uv * zoom;
}

vec2 tzb_zoomedXYIndex(vec2 zoomed_uv){
  return floor(zoomed_uv);
}

vec2 tzb_zoomedXYCoords(vec2 zoomed_uv){
  return fract(zoomed_uv);
}
   

uniform vec2 u_resolution;
uniform float u_time;

float PI = 3.14159265359;
float TWO_PI = 6.28318530718;

 

vec3 darkColor         = vec3(0.298, 0.686, 0.314);
vec3 lightColor        = vec3(0.627, 0.945, 0.263);
vec3 lighterLightColor = vec3(0.698, 0.957, 0.361);
vec3 darkerLightColor  = vec3(0.561, 0.847, 0.227);
vec3 homeDarkColor     = vec3(0.000, 0.000, 0.008);
vec3 homeLightColor    = vec3(0.086, 0.220, 0.020);
vec3 metalLightColor   = vec3(0.8392, 0.9255, 0.9569);
vec3 metalDarkColor    = vec3(0.5176, 0.5255, 0.5451);


half4 main(vec2 fragCoord) {
    vec3 startColor = vec3(${color1Converted});
    vec3 endColor   = vec3(${color2Converted});

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  //uv.y = fract(uv.y + u_time *.5);
    uv = uv - vec2(0.0);

  float beatsPerSecond = 10.0;
  float beat = floor(mod(u_time * beatsPerSecond, 8.0));   

   
float scale = 8.;
uv *= scale;
   float a = atan(uv.x, uv.y);

float lightUpTile = 0.;
 

    float height = .5;

 
 float pulse = 1.;
  

 
  float toeRange = PI - .1;

  float walkingSpeed = 5.;
 
 

vec2 topLeftHandSlice     = vec2(-0.2,  0.45 *abs(sin(u_time * walkingSpeed)));
vec2 topRightHandSlice    = vec2( 0.2,  0.45*abs(cos(u_time * walkingSpeed)));
vec2 bottomLeftHandSlice  = vec2(-0.2, -0.45 *abs(sin(u_time * walkingSpeed)));
vec2 bottomRightHandSlice = vec2( 0.2, -0.45*abs(cos(u_time * walkingSpeed)));

 
float toeLength = .08;
float toeThickness = .003;
float circleSize = .02;
 

  uv = tzb_select(uv, topLeftHandSlice);

  float handTopLeft = geckoHand(uv, toeRange, toeLength, toeThickness, circleSize);
  uv = tzb_deselect(uv, topLeftHandSlice);


  uv = tzb_select(uv, bottomLeftHandSlice);
  float handBottomLeft = geckoHand(uv, toeRange, toeLength, toeThickness, circleSize);
  uv = tzb_deselect(uv, bottomLeftHandSlice);


    uv = tzb_select(uv, topRightHandSlice);
  float handTopRight = geckoHand(uv, toeRange, toeLength, toeThickness, circleSize);
  uv = tzb_deselect(uv, topRightHandSlice);


  uv = tzb_select(uv, bottomRightHandSlice);
  float handBottomRight = geckoHand(uv, toeRange, toeLength, toeThickness, circleSize);
  uv = tzb_deselect(uv, bottomRightHandSlice);

  float leftHands = max(handTopLeft, handBottomLeft);
float rightHands = max(handTopRight, handBottomRight);

 
 
  float mask = leftHands + rightHands;
  uv += vec2(.5, .5);
  return vec4(startColor * mask , mask);
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

export default SpinnerGeckoToes;
