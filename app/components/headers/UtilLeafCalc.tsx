// import {
//   SharedValue,
//   withDelay,
//   withTiming,
//   useDerivedValue,
//   useSharedValue,
//   Easing,
//   runOnJS,
// } from "react-native-reanimated";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// type Props = {
//   categoryTotals: SharedValue<number>;
//   lastCount: SharedValue<number>;
//   scale: SharedValue<number>;
//   count: SharedValue<number>;
//   decimals: SharedValue<number[]>;
//   colors: string[];
//   centerX: number;
//   centerY: number;
//   radius: number;
// };

// export default function calculateLeaves({
//   totalJS, 
//   categoryTotals,
 
 
//   lastCount,
//   scale,
//   count,
//   decimals,
//   colors,
//   centerX,
//   centerY,
//   radius,
//   setPositionsJS,
// }: Props) {

 
// //   const lastFriendIdValue = useSharedValue(friendIdValue.value);

//   useDerivedValue(() => { 
 
 
 
 
//     // Guard: required values must exist

//     // console.log(count.value)
//     if (!count.value || totalJS === 0 || 
//         totalJS < Number(count.value) ||
//          !decimals || decimals.value.length < 1) {
     
//       if (lastCount.value !== -1) {
//         runOnJS(setPositionsJS)([]);
//         lastCount.value = -1;
//       }
 
//       return;
//     }

//     //  const n = Math.floor(categoryTotals.value);
//     const n = Math.round(categoryTotals.value);

//     // Only update if count changed
//     if (lastCount.value === n) return [];

//     const arr: { x: number; y: number; size: number; color: string }[] = [];
//     const boxSize = radius * 2;
//     const columns = Math.ceil(Math.sqrt(n - 1));
//     const rows = Math.ceil((n - 1) / columns);

//     for (let i = 0; i < n; i++) {
//       const decSize = decimals.value[i] ?? 1;

//       if (i === 0) {
//         arr.push({
//           x: centerX - decSize * 10,
//           y: centerY,
//           size: decSize * 10,
//           color: colors[0],
//         });
//       } else {
//         const index = i - 1;
//         const col = index % columns;
//         const row = Math.floor(index / columns);

//         const offsetX =
//           ((col + 0.5) / columns - 0.5) * boxSize * 2.4 + decSize * 5;
//         const offsetY =
//           ((row + 0.5) / rows - 0.5) * boxSize * 2.4 + decSize * 5;

//         arr.push({
//           x: centerX + offsetX,
//           y: centerY + offsetY,
//           size: decSize * 10,
//           color: colors[i] ?? colors[0],
//         });
//       }

//       // Animate leaf scale (optional, stays local to leaf)
//       scale.value = withDelay(
//         i * 120,
//         withTiming((i + 1) * 0.5, {
//           duration: 100,
//           easing: Easing.out(Easing.exp),
//         })
//       );
//     }
//     runOnJS(setPositionsJS)(arr);
//     lastCount.value = n; 
//   }, [[colors, centerX, centerY, radius]]);
// }


"use worklet";

import { withDelay, withTiming, Easing } from "react-native-reanimated";

type Props = {
  totalJS: number | SharedValue<number>;
  categoryTotals: SharedValue<number>;
  lastCount: SharedValue<number>;
  scale: SharedValue<number>;
  count: SharedValue<number>;
  decimals: SharedValue<number[]>;
  colors: string[];
  centerX: number;
  centerY: number;
  radius: number;
  positionsValue: SharedValue<
    { x: number; y: number; size: number; color: string }[]
  >;
};

export function calculateLeavesWorklet({
  totalJS,
  categoryTotals,
  lastCount,
  scale,
  count,
  decimals,
  colors,
  centerX,
  centerY,
  radius,
  positionsValue,
}: Props) {
  "worklet";

  // Guard: required values
  if (
    !count.value ||
    (typeof totalJS === "number" ? totalJS === 0 : totalJS.value === 0) ||
    (typeof totalJS === "number"
      ? totalJS < Number(count.value)
      : totalJS.value < Number(count.value)) ||
    !decimals?.value ||
    decimals.value.length < 1
  ) {
    if (lastCount.value !== -1) {
      positionsValue.value = [];
      lastCount.value = -1;
    }
    return;
  }

  const n = Math.round(categoryTotals.value);

  if (lastCount.value === n) return;

  const arr: { x: number; y: number; size: number; color: string }[] = [];
  const boxSize = radius * 2;
  const columns = Math.ceil(Math.sqrt(n - 1));
  const rows = Math.ceil((n - 1) / columns);

  for (let i = 0; i < n; i++) {
    const decSize = decimals.value[i] ?? 1;

    if (i === 0) {
      arr.push({
        x: centerX - decSize * 10,
        y: centerY,
        size: decSize * 10,
        color: colors[0],
      });
    } else {
      const index = i - 1;
      const col = index % columns;
      const row = Math.floor(index / columns);

      const offsetX =
        ((col + 0.5) / columns - 0.5) * boxSize * 2.4 + decSize * 5;
      const offsetY =
        ((row + 0.5) / rows - 0.5) * boxSize * 2.4 + decSize * 5;

      arr.push({
        x: centerX + offsetX,
        y: centerY + offsetY,
        size: decSize * 10,
        color: colors[i] ?? colors[0],
      });
    }

    // Animate scale per leaf
    scale.value = withDelay(
      i * 120,
      withTiming((i + 1) * 0.5, {
        duration: 100,
        easing: Easing.out(Easing.exp),
      })
    );
  }

  positionsValue.value = arr;
  lastCount.value = n;
}
