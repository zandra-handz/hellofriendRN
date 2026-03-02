import React, { useEffect } from "react";
import { Group } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { Skia } from "@shopify/react-native-skia";
import { DotInstance } from "./DotInstance";

interface NotLeafPathProps {
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

  const dotSvgString = Skia.Path.MakeFromSVGString(
    "M 0,-8 A 8,8 0 1,0 0,8 A 8,8 0 1,0 0,-8 Z",
  );


export default function DotPaths({
  // colorsReversed,
  // colors,
  positions,
  useColors = false,
  highlightColor = null,
  highlightCatID = null,
}: NotLeafPathProps) {
  const isSleeping = useSharedValue(false);

  // const dotSvgString = Skia.Path.MakeFromSVGString(
  //   "M 0,-8 A 8,8 0 1,0 0,8 A 8,8 0 1,0 0,-8 Z",
  // );

  useEffect(() => {
    const lastLeafFinish = (positions.length - 1) * 120 + 500;
    const timeout = setTimeout(() => {
      isSleeping.value = true;
      console.log("is sleeping");
    }, lastLeafFinish);
    return () => clearTimeout(timeout);
  }, [positions.length]);

  return (
    <>
      <Group blendMode="multiply">
        {positions.map((p, i) => (
          <DotInstance
            key={`${i}-${positions[i].x}-${positions[i].y}-${positions[i].color}`}
            dotPath={dotSvgString}
            x={positions[i].x}
            y={positions[i].y}
            size={positions[i].size}
            index={i}
            catId={positions[i].catId}
            // color={colorsReversed[i]}
            color={positions[i].color}
            isSleeping={isSleeping}
            useColors={useColors}
            highlightColor={highlightColor}
            highlightCatID={highlightCatID}
          />
        ))}
      </Group>
    </>
  );
}
