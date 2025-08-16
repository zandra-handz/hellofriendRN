import { View, Text } from "react-native";
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
  decimalsValue: SharedValue<number[]>;
  index: number;
};

const DonutPath = ({
  radius,
  gap,
  strokeWidth,
  outerStrokeWidth,
  color,
  decimalsValue,
  index,
}: Props) => {
  const innerRadius = radius - outerStrokeWidth / 2;

  const path = Skia.Path.Make();

  path.addCircle(radius, radius, innerRadius);

  const start = useDerivedValue(() => {
    if (index === 0) {
      return gap;
    }
    const decimal = decimalsValue.value.slice(0, index);

    const sum = decimal.reduce((acc, currentValue) => acc + currentValue, 0);

    return withTiming(sum + gap, {
      duration: 1000,
    });
  }); 

  const end = useDerivedValue(() => {
    if (index === decimalsValue.value.length - 1) {
      return withTiming(1, { duration: 1000 });
    }
    const decimal = decimalsValue.value.slice(0, index + 1);

    const sum = decimal.reduce((acc, currentValue) => acc + currentValue, 0);

    return withTiming(sum, {
      duration: 1000,
    });
  }); 

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeWidth={strokeWidth}
    strokeJoin="round"
     // strokeJoin="miter"
      strokeCap="square"
      // strokeCap="round"
      start={start}
      end={end}
    />
  );
};

export default DonutPath;
