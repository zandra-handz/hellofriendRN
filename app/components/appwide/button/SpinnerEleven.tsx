// import React from "react";
// import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
// import { Dimensions, View } from "react-native";
// import { useDerivedValue } from "react-native-reanimated";

// const { width, height } = Dimensions.get("window");

// const hexToVec3 = (hex) => {
//   const cleanHex = hex.replace("#", "");
//   const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
//   const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
//   const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
//   return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
// };

// const SpinnerEleven = ({ color1, color2 }) => {
//   const clock = useClock();
//   const color1Converted = hexToVec3(color1);
//   const color2Converted = hexToVec3(color2);

//   const source = Skia.RuntimeEffect.Make(`
// uniform vec2 u_resolution;
// uniform float u_time;

// float makeCircle(vec2 coords, float radius) {
//   vec2 dist = coords - vec2(0.5);
//   return 1. - smoothstep(radius - (radius * 0.01), radius * (radius * sin(u_time)), dot(dist, dist) * 4.);
// }

// half4 main(vec2 fragCoord) {
//   vec3 startColor = vec3(${color1Converted});
//   vec3 endColor   = vec3(${color2Converted});

//   vec2 uv = fragCoord / u_resolution.xy;
//   float aspect = u_resolution.y / u_resolution.x;
//   uv.y *= aspect;
//   uv.y -= (aspect - 1.0) * 0.5;

//   float c = makeCircle(uv, 0.9);

//   vec3 color = mix(startColor, endColor, c);

//   return half4(color, 1.0);
// }
// `);

//   if (!source) {
//     console.error("❌ SpinnerEleven shader failed to compile");
//     return null;
//   }

//   const uniforms = useDerivedValue(() => ({
//     u_time: clock.value / 1000,
//     u_resolution: [width, height],
//   }));

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {color1Converted && color2Converted && (
//         <Canvas style={{ width, height }}>
//           <Rect x={0} y={0} width={width} height={height}>
//             <Shader source={source} uniforms={uniforms} />
//           </Rect>
//         </Canvas>
//       )}
//     </View>
//   );
// };

// export default SpinnerEleven;


import React from "react";
import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerEleven = ({ color1, color2 }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_time;

float makeCircle(vec2 coords, float radius) {
  vec2 dist = coords - vec2(0.5);
  return 1. - smoothstep(radius - (radius * 0.01), radius * (radius * sin(u_time)), dot(dist, dist) * 4.);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = fragCoord / u_resolution.xy;
  float aspect = u_resolution.y / u_resolution.x;
  uv.y *= aspect;
  uv.y -= (aspect - 1.0) * 0.5;

  float c = makeCircle(uv, 0.9);
  c = pow(c, 3.0);

  vec3 color = mix(startColor, endColor, c);

  return half4(color, 1.0);
}
`);

  if (!source) {
    console.error("❌ SpinnerEleven shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_resolution: [width, height],
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {color1Converted && color2Converted && (
        <Canvas style={{ width, height }}>
          <Rect x={0} y={0} width={width} height={height}>
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
};

export default SpinnerEleven;