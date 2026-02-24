import React from "react";
import {
  SharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { Skia, Path } from "@shopify/react-native-skia";

type Props = {
  radius: number;
  gap: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  color: string;
  bgColor?: string;
  decimalsValue: SharedValue<number[]>;
  index: number;
};

const NotDonutPath = ({
  radius,
  gap,
  strokeWidth,
  outerStrokeWidth,
  color,
  bgColor = "rgba(255,255,255,0.15)",
  decimalsValue,
  index,
}: Props) => {
  const innerRadius = radius - outerStrokeWidth / 2;


  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const start = useDerivedValue(() => {
    if (index === 0) return gap;
    const decimal = decimalsValue.value.slice(0, index);
    const sum = decimal.reduce((acc, currentValue) => acc + currentValue, 0);
    return withTiming(sum + gap, { duration: 1000 });
  });

  const end = useDerivedValue(() => {
    if (index === decimalsValue.value.length - 1) {
      return withTiming(1, { duration: 1000 });
    }
    const decimal = decimalsValue.value.slice(0, index + 1);
    const sum = decimal.reduce((acc, currentValue) => acc + currentValue, 0);
    return withTiming(sum, { duration: 1000 });
  });

  return (
    <>
      {/* full background ring, only rendered once for index 0 */}
{index === 0 && (
  <Path
    path={path}
    color="limegreen"
    style="stroke"
    strokeWidth={strokeWidth + 1}  // thicker so it peeks out from behind
    strokeCap="square"
  />
)}
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeJoin="round"
        strokeCap="square"
        start={start}
        end={end}
      />
    </>
  );
};

export default NotDonutPath;