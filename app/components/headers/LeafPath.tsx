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
  
}: LeafPathProps) {
 
  
 

  const leafSvgString = Skia.Path.MakeFromSVGString(
    "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
  );
 
 
  return (
    <Group blendMode="multiply">
      {positions.length > 0 && positions.map((p, i) => (
        <LeafInstance
          key={i}
          leafPath={leafSvgString}
          x={positions[i].x}
          y={positions[i].y}
          size={positions[i].size}
          index={i}
          //color={p.color}
          // color={colors[i]} [reversed colors]
          color={positions[i].color}
        />
      ))}
    </Group>
  );
}
