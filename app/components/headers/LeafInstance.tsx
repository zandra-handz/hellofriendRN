import React, { useEffect  } from "react";

import {
  Group,
  Path,
  usePathValue,
  processTransform2d,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
 useDerivedValue,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
 


// const leafPath =
//   "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z";

 

export function LeafInstance({
  leafPath,
  x,
  y,
  size,
  index,
  color,
}: {
  leafPath: SkPath;
  x: number;
  y: number;
  size: number;
  index: number;
  color: string;
}) {
  const scale = useSharedValue(0);
//   console.log(x, y, size, index, color)


  // delay between leaves
  // useDerivedValue is too slow
useEffect(() => {
  scale.value = 0; // reset before animation
  scale.value = withDelay(
    index * 120,
    withTiming((index + 1) * 0.5, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    })
  );
}, [x, y, size, color]);

  

  const clip = usePathValue((path) => {
    "worklet";
    path.transform(processTransform2d([{ scale: scale.value }]));
  }, leafPath);

  return (
    <Path
      path={clip}
      color={color}
      style="fill"
      transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
    />
  );
}