import React, { useEffect, useState } from "react";

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

import { Skia } from "@shopify/react-native-skia";

function LeafInstance({
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

  useEffect(() => {
    scale.value = withDelay(
      index * 120,
      withTiming((index + 1) * 0.5, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      })
    );
  }, []);

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

interface LeafPathProps {
  count: ReturnType<typeof useSharedValue>; // Reanimated shared value
  centerX: number;
  centerY: number;
  radius: number;
  colors: string[]; // not sure h/o
}
 
export default function LeafPath({
  count,
  categoryTotals,
 
  decimals,
  centerX,
  centerY,
  radius,
  colors,
}: LeafPathProps) {
  const leafPath = Skia.Path.MakeFromSVGString(
    "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
  );
 
 

 
  const scale = useSharedValue(0);

  const [positionsJS, setPositionsJS] = useState([]);
  const lastCount = useSharedValue(-1); // default to -1 so first update runs

  useDerivedValue(() => {
 
    // Guard: required values must exist
    if (!count || !decimals || decimals?.value?.length < 1) {
      if (lastCount.value !== -1) {
        // NEED THIS CHECK OR WILL RERENDER FOREVER WHEN COMPONENT MOUNTED
        runOnJS(setPositionsJS)([]);
        lastCount.value = -1;
      }
      return;
    }

    const n = Math.floor(categoryTotals.value);

    // Only update if count changed
    if (lastCount.value === n) return;

    const arr: { x: number; y: number }[] = [];
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

      // Animate leaf scale (optional, stays local to leaf)
      scale.value = withDelay(
        i * 120,
        withTiming((i + 1) * 0.5, {
          duration: 100,
          easing: Easing.out(Easing.exp),
        })
      );
    }

    runOnJS(setPositionsJS)(arr);
    lastCount.value = n; // update shared value
  }, [count, decimals, colors, centerX, centerY, radius]);

  return (
    <Group blendMode="multiply">
      {positionsJS?.map((p, i) => (
        <LeafInstance
          key={i}
          leafPath={leafPath}
          x={p.x}
          y={p.y}
          size={p.size}
          index={i}
          color={p.color}
        />
      ))}
    </Group>
  );
}
