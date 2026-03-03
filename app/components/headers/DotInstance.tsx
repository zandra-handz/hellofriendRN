

// // import React, { useEffect, useState } from "react";
// // import { Path, usePathValue, processTransform2d, SkPath } from "@shopify/react-native-skia";
// // import { useSharedValue, withTiming, withDelay, Easing, SharedValue, runOnJS } from "react-native-reanimated";

// // export function DotInstance({
// // dotPath,
// //   x,
// //   y,
// //   size,
// //   index,
// //   color,
// //   catId,
// //   isSleeping,
// //   useColors,
// //   highlightColor,
// //   highlightCatID,
  
// // }: {
// //   dotPath: SkPath;
// //   x: number;
// //   y: number;
// //   size: number;
// //   index: number;
// //   color: string;
// //   catId: string;
// //   isSleeping: SharedValue<boolean>;
// //   useColors: boolean;
// // }) {
// //   const scale = useSharedValue(0);
// //   const [sleeping, setSleeping] = useState(false);
// //   const [finalPath, setFinalPath] = useState<SkPath | null>(null);

// //   useEffect(() => {
// //     scale.value = 0;
// //     const groupSize = 5;
// //     const group = Math.floor(index / groupSize);
// //     const delay = group * 50;

// //     scale.value = withDelay(
// //       delay,
// //       withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) },
// //         (finished) => {
// //           if (finished) {
// //             const pathCopy = dotPath.copy();
// //             pathCopy.transform(processTransform2d([{ scale: 1 }]));
// //             runOnJS(setFinalPath)(pathCopy);
// //             runOnJS(setSleeping)(true);
// //             isSleeping.value = true;
// //           }
// //         }
// //       )
// //     );
// //   }, [x, y, size, color]);

// //   const clip = usePathValue((path) => {
// //     "worklet";
// //     path.transform(processTransform2d([{ scale: scale.value }]));
// //   }, dotPath);

// //   const leafColor = useColors ? color : "rgba(220,220,235,0.6)";
// //   const isHighlighted = (catId === highlightCatID);// (leafColor === highlightColor);

// //   return (
// //     <>
// //       {sleeping && finalPath ? (
// //         <Path
// //           path={finalPath}
// //           color={leafColor}
// //           style="fill"
// //           opacity={isHighlighted ? 1 : .3}
// //           transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
// //         />
// //       ) : (
// //         <Path
// //           path={clip}
// //           color={leafColor}
// //            opacity={isHighlighted ? 1 : .3}
// //           style="fill"
// //           transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
// //         />
// //       )}
// //     </>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Path, usePathValue, processTransform2d, SkPath } from "@shopify/react-native-skia";
// import { useSharedValue, withTiming, withDelay, Easing, SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";

// export function DotInstance({
//   dotPath,
//   x,
//   y,
//   size,
//   index,
//   color,
//   catId,
//   isSleeping,
//   useColors,
//   highlightColor,
//   highlightCatID,
// }: {
//   dotPath: SkPath;
//   x: number;
//   y: number;
//   size: number;
//   index: number;
//   color: string;
//   catId: string;
//   isSleeping: SharedValue<boolean>;
//   useColors: boolean;
//   highlightColor: string | null;
//   highlightCatID: string | null;
// }) {
//   const scale = useSharedValue(0);
//   const pulseScale = useSharedValue(1);
//   const [sleeping, setSleeping] = useState(false);
//   const [finalPath, setFinalPath] = useState<SkPath | null>(null);

//   const isHighlighted = catId === highlightCatID;

//   useEffect(() => {
//     if (isHighlighted) {
//       pulseScale.value = 1;
//       pulseScale.value = withTiming(3, { duration: 200, easing: Easing.out(Easing.ease) }, () => {
//         pulseScale.value = withTiming(2, { duration: 150 });
//       });
//     } else {
//       pulseScale.value = withTiming(1, { duration: 200 });
//     }
//   }, [isHighlighted]);

//   useEffect(() => {
//     scale.value = 0;
//     setSleeping(false);
//     setFinalPath(null);

//     const groupSize = 5;
//     const group = Math.floor(index / groupSize);
//     const delay = group * 50;

//     scale.value = withDelay(
//       delay,
//       withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) },
//         (finished) => {
//           if (finished) {
//             const pathCopy = dotPath.copy();
//             pathCopy.transform(processTransform2d([{ scale: 1 }]));
//             runOnJS(setFinalPath)(pathCopy);
//             runOnJS(setSleeping)(true);
//             isSleeping.value = true;
//           }
//         }
//       )
//     );
//   }, [x, y, size, color]);

//   const clip = usePathValue((path) => {
//     "worklet";
//     path.transform(processTransform2d([{ scale: scale.value }]));
//   }, dotPath);

//   const animatedTransform = useDerivedValue(() => {
//     "worklet";
//     const s = size * scale.value * pulseScale.value;
//     return [{ translateX: x }, { translateY: y }, { scale: s }];
//   }, [pulseScale, scale]);

//   const leafColor = useColors ? color : "rgba(220,220,235,0.6)";

//   useEffect(() => {
//   if (!useColors) {
//     pulseScale.value = withTiming(1, { duration: 200 });
//   }
// }, [useColors]);

//   return (
//     <Path
//       path={sleeping && finalPath ? finalPath : clip}
//       color={leafColor}
//       opacity={isHighlighted && useColors ? 1 : 0.3}
//       style="fill"
//       transform={animatedTransform}
//     />
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Path,
  usePathValue,
  processTransform2d,
  SkPath,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";

export function DotInstance({
  dotPath,
  x,
  y,
  size,
  index,
  color,
  catId,
  isSleeping,
  useColors,
  highlightColor,
  highlightCatID,
}: {
  dotPath: SkPath;
  x: number;
  y: number;
  size: number;
  index: number;
  color: string;
  catId: string;
  isSleeping: SharedValue<boolean>;
  useColors: boolean;
  highlightColor: string | null;
  highlightCatID: string | null;
}) {
  const scale = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const [sleeping, setSleeping] = useState(false);
  const [finalPath, setFinalPath] = useState<SkPath | null>(null);

  const isHighlighted = catId === highlightCatID;

  useEffect(() => {
    if (isHighlighted) {
      pulseScale.value = 1;
      pulseScale.value = withTiming(
        3,
        { duration: 200, easing: Easing.out(Easing.ease) },
        () => {
          pulseScale.value = withTiming(2, { duration: 150 });
        },
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [isHighlighted]);

  useEffect(() => {
    scale.value = 0;
    setSleeping(false);
    setFinalPath(null);

    const groupSize = 5;
    const group = Math.floor(index / groupSize);
    const delay = group * 50;

    scale.value = withDelay(
      delay,
      withTiming(
        1,
        { duration: 500, easing: Easing.out(Easing.exp) },
        (finished) => {
          if (finished) {
            const pathCopy = dotPath.copy();
            pathCopy.transform(processTransform2d([{ scale: 1 }]));
            runOnJS(setFinalPath)(pathCopy);
            runOnJS(setSleeping)(true);
            isSleeping.value = true;
          }
        },
      ),
    );
  }, [x, y, size, color]);

  const clip = usePathValue((path) => {
    "worklet";
    path.transform(processTransform2d([{ scale: scale.value }]));
  }, dotPath);

  const animatedTransform = useDerivedValue(() => {
    "worklet";
    const s = size * scale.value * pulseScale.value;
    return [{ translateX: x }, { translateY: y }, { scale: s }];
  }, [pulseScale, scale]);

  // Fill color
  const leafColor = useColors ? color : "rgba(220,220,235,0.6)";

  // Outline only when NOT using colors (monochrome mode)
  const showOutline = !useColors;
  const outlineColor = "rgba(0,0,0,0.55)"; // tweak
  const outlineWidth = 0.9; // tweak: 0.6–1.4 usually looks good

  const pathToDraw = sleeping && finalPath ? finalPath : clip;

  // Keep your opacity logic, but avoid dimming monochrome too much if you want
  const opacity = isHighlighted && useColors ? 1 : 0.3;

  return (
    <>
      {showOutline && (
        <Path
          path={pathToDraw}
          style="stroke"
          color={outlineColor}
          strokeWidth={outlineWidth}
          strokeJoin="round"
          strokeCap="round"
          opacity={0.75} // outline opacity (separate from fill)
          transform={animatedTransform}
        />
      )}

      <Path
        path={pathToDraw}
        color={leafColor}
        opacity={opacity}
        style="fill"
        transform={animatedTransform}
      />
    </>
  );
}