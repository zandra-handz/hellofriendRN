

import React, { useEffect, useState } from "react";
import { Path, usePathValue, processTransform2d, SkPath } from "@shopify/react-native-skia";
import { useSharedValue, withTiming, withDelay, Easing, SharedValue, runOnJS } from "react-native-reanimated";

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
}) {
  const scale = useSharedValue(0);
  const [sleeping, setSleeping] = useState(false);
  const [finalPath, setFinalPath] = useState<SkPath | null>(null);

  useEffect(() => {
    scale.value = 0;
    const groupSize = 5;
    const group = Math.floor(index / groupSize);
    const delay = group * 50;

    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) },
        (finished) => {
          if (finished) {
            const pathCopy = dotPath.copy();
            pathCopy.transform(processTransform2d([{ scale: 1 }]));
            runOnJS(setFinalPath)(pathCopy);
            runOnJS(setSleeping)(true);
            isSleeping.value = true;
          }
        }
      )
    );
  }, [x, y, size, color]);

  const clip = usePathValue((path) => {
    "worklet";
    path.transform(processTransform2d([{ scale: scale.value }]));
  }, dotPath);

  const leafColor = useColors ? color : "rgba(220,220,235,0.6)";
  const isHighlighted = (catId === highlightCatID);// (leafColor === highlightColor);

  return (
    <>
      {sleeping && finalPath ? (
        <Path
          path={finalPath}
          color={leafColor}
          style="fill"
          opacity={isHighlighted ? 1 : .3}
          transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
        />
      ) : (
        <Path
          path={clip}
          color={leafColor}
           opacity={isHighlighted ? 1 : .3}
          style="fill"
          transform={[{ translateX: x }, { translateY: y }, { scale: size }]}
        />
      )}
    </>
  );
}