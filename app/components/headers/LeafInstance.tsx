// import React, { useEffect, useState  } from "react";

// import { 
//   Path,
//   usePathValue,
//   processTransform2d,
// } from "@shopify/react-native-skia";
// import {
//   useSharedValue, 
//   withTiming,
//   withDelay,
//   Easing,
//   runOnJS,
//   SharedValue,
// } from "react-native-reanimated";
 


 

// export function LeafInstance({
//   leafPath,
//   x,
//   y,
//   size,
//   index,
//   color,
//   isSleeping,
// }: {
//   leafPath: SkPath;
//   x: number;
//   y: number;
//   size: number;
//   index: number;
//   color: string;
//   isSleeping: SharedValue<boolean>;
// }) {
//   const scale = useSharedValue(0); 

// //   console.log(x, y, size, index, color)


//   // delay between leaves
//   // useDerivedValue is too slow
// useEffect(() => {
//   scale.value = 0; // reset before animation
//   scale.value = withDelay(
//     index * 120,
//     withTiming((index + 1) * 0.5, {
//       duration: 500,
//       easing: Easing.out(Easing.exp),
//     })
//   );
// }, [x, y, size, color]);
 


//   // const clip = usePathValue((path) => {
//   //   "worklet";
//   //   path.transform(processTransform2d([{ scale: scale.value }]));
//   // }, leafPath);

//   const clip = usePathValue((path) => {
//   "worklet"; 
   
//   // if (!isSleeping.value) {
   
//     path.transform(processTransform2d([{ scale: scale.value }]));
//   // }
// }, leafPath);

//   return (
//     <> 
    
//     <Path
//       path={clip}
//       color={color}
//       style="fill"
//       transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
//     />
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import { Path, usePathValue, processTransform2d, SkPath } from "@shopify/react-native-skia";
import { useSharedValue, withTiming, withDelay, Easing, SharedValue, runOnJS } from "react-native-reanimated";
export function LeafInstance({
  leafPath,
  x,
  y,
  size,
  index,
  color,
  isSleeping,
}: {
  leafPath: SkPath;
  x: number;
  y: number;
  size: number;
  index: number;
  color: string;
  isSleeping: SharedValue<boolean>;
}) {
  const scale = useSharedValue(0);
  const [sleeping, setSleeping] = useState(false);
  const [finalPath, setFinalPath] = useState<SkPath | null>(null);

  useEffect(() => {
    scale.value = 0;

    scale.value = withDelay(
      index * 120,
      withTiming(
        (index + 1) * 0.5,
        { duration: 500, easing: Easing.out(Easing.exp) },
        (finished) => {
          if (finished) {
            // Create static copy
            const pathCopy = leafPath.copy();
            pathCopy.transform(processTransform2d([{ scale: (index + 1) * 0.5 }]));
            // runOnJS to update state safely
            runOnJS(setFinalPath)(pathCopy);
            runOnJS(setSleeping)(true);

            // also mark the shared value, if other worklets depend on it
            isSleeping.value = true;
          }
        }
      )
    );
  }, [x, y, size, color]);

  const clip = usePathValue((path) => {
    "worklet";
    path.transform(processTransform2d([{ scale: scale.value }]));
  }, leafPath);

  return (
    <>
      {sleeping && finalPath ? (
        <Path
          path={finalPath}
          color={color}
          style="fill"
          transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
        />
      ) : (
        <Path
          path={clip}
          color={color}
          style="fill"
          transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
        />
      )}
    </>
  );
}
