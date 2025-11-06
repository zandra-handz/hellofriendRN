// import React from "react";
// import { Canvas, Rect, useImage, ImageShader } from "@shopify/react-native-skia";
// import { Skia } from "@shopify/react-native-skia";

// const LiquidGlassExp = () => {
//   // Load image
//   const image = useImage(require("@/app/assets/shapes/lizard.png"));

//   // Make shader safely
//   const source = Skia.RuntimeEffect.Make(`
//     uniform shader image;
//     half4 main(float2 xy) {
//       vec3 color = image.eval(xy).rgb;
//       // Invert colors for test
//       return vec4(vec3(1.0) - color, 1.0);
//     }
//   `);

//   // ✅ Guard: if image not loaded or shader failed to compile, render nothing
//   if (!image || !source) return null;

//   return (
//     <Canvas style={{ flex: 1, width: 300, height: 100,  backgroundColor: "red" }}>
//       <Rect x={0} y={0} width={300} height={300}>
//         <ImageShader
//           image={image}
//           x={0}
//           y={0}
//           width={300}
//           height={300}
//           fit="cover"
//         />
//       </Rect>
//     </Canvas>
//   );
// };

// export default LiquidGlassExp;
