import React, { useEffect, useState } from "react";
import { Group } from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { Skia } from "@shopify/react-native-skia";
import { calculateLeavesWorklet } from "./UtilLeafCalc";
import { LeafInstance } from "./LeafInstance";

interface LeafPathProps {
  totalJS: number | SharedValue<number>;
  count: ReturnType<typeof useSharedValue>;
  totalValue: ReturnType<typeof useSharedValue>;
  categoryStops: ReturnType<typeof useSharedValue>;
  decimals: ReturnType<typeof useSharedValue>;
  centerX: number;
  centerY: number;
  radius: number;
  colors: string[];
  flushLeaves?: ReturnType<typeof useSharedValue>;
  delayMs?: number; // optional delay in milliseconds
}

export default function LeafPath({
  totalJS,
  count,
  totalValue,
  categoryStops,
  decimals,
  centerX,
  centerY,
  radius,
  colors,
  delayMs = 100, // default delay 100ms
  positionsValue,
  positions,
 
  lastFlush,
}: LeafPathProps) {
  const scale = useSharedValue(0);
  const lastCount = useSharedValue(-1);
  // const positionsValue = useSharedValue<
  //   { x: number; y: number; size: number; color: string }[]
  // >([]);
console.log(positions)
const prevFlush = useSharedValue(-1); // store previous flush timestamp


 
  const [positionsJS, setPositionsJS] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

//   useDerivedValue(() => {
//   'worklet';
//   // Only reset when lastFlush changes
//   if (lastFlush.value !== prevFlush.value) {
//     console.log('UPDATING FLUSH')
//         runOnJS(setPositionsJS)([])
//     positionsValue.value = [];
//     scale.value = 0;
//     lastCount.value = -1;


//     // update prevFlush to current flush timestamp
//     prevFlush.value = lastFlush.value;
//   }
// }, [lastFlush]);


  // useEffect(() => {
  //   console.log(`positions:`, positionsJS, colors)

  // }, [positionsJS]);
  const [show, setShow] = useState(false); // controls delayed render

  // show component after a short delay
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timeout); // cleanup
  }, [delayMs]);

  // Derived category totals
  const categoryTotals = useDerivedValue(() => {
    if (!categoryStops.value || categoryStops.value.length === 0) return 0;

    const total = Math.ceil(totalValue.value);
    for (let i = 0; i < categoryStops.value.length; i++) {
      if (total <= categoryStops.value[i]) return i + 1;
    }
    return categoryStops.value.length;
  });

  // Calculate leaves on UI thread
  // useDerivedValue(() => {
  //   calculateLeavesWorklet({
  //     totalJS,
  //     categoryTotals,
  //     lastCount,
  //     scale,
  //     count,
  //     decimals,
  //     colors,
  //     centerX,
  //     centerY,
  //     radius,
  //     positionsValue,
  //   });
  // }, [count, categoryTotals, decimals, colors, lastFlush]);

  // Mirror UI thread → JS thread
  useDerivedValue(() => {
    runOnJS(setPositionsJS)(positionsValue.value);
  }, [positionsValue]);

 

  const leafSvgString = Skia.Path.MakeFromSVGString(
    "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
  );
 
  // don't render until delay expires
  if (!show) return null;

  return (
    <Group blendMode="multiply">
      {positions.map((p, i) => (
        <LeafInstance
          key={i}
          leafPath={leafSvgString}
          x={positions[i].x}
          y={positions[i].y}
          size={positions[i].size}
          index={i}
          //color={p.color}
          color={colors[i]}
        />
      ))}
    </Group>
  );
}
