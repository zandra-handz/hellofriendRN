import React, { ReactNode, useState, useCallback } from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Canvas,
  Rect,
  LinearGradient as SkiaLinearGradient,
  vec,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

const FROSTED_COLOR = "#ffffff";
const FROSTED_OPACITY = 0.28;
const FROSTED_FOG_COLOR = "#cfd4da";
const FROSTED_FOG_OPACITY = 0.18;
const FROSTED_HAZE_COLORS: [string, string, string] = [
  `${FROSTED_COLOR}33`,
  `${FROSTED_COLOR}00`,
  `${FROSTED_COLOR}55`,
];
const FROSTED_HAZE_LOCATIONS: [number, number, number] = [0, 0.5, 1];

interface GradientBackgroundSharedProps {
  friendColorLight: SharedValue<string>;
  friendColorDark: SharedValue<string>;
  additionalStyles?: StyleProp<ViewStyle>;
  frosted?: boolean;
  children: ReactNode;
}

const GradientBackgroundShared: React.FC<GradientBackgroundSharedProps> = ({
  friendColorLight,
  friendColorDark,
  additionalStyles,
  frosted = true,
  children,
}) => {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.w === width && prev.h === height ? prev : { w: width, h: height },
    );
  }, []);

  const colors = useDerivedValue(() => [
    friendColorDark.value,
    friendColorLight.value,
  ]);

  const gradientEnd = useDerivedValue(() => vec(0, size.h));

  return (
    <View style={[styles.container, additionalStyles]} onLayout={onLayout}>
      {size.w > 0 && size.h > 0 ? (
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={size.w} height={size.h}>
            <SkiaLinearGradient
              start={vec(0, 0)}
              end={gradientEnd}
              colors={colors}
            />
          </Rect>
        </Canvas>
      ) : null}
      {frosted ? (
        <>
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.frosted]}
          />
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.frostedFog]}
          />
          <LinearGradient
            pointerEvents="none"
            colors={FROSTED_HAZE_COLORS}
            locations={FROSTED_HAZE_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  frosted: {
    backgroundColor: FROSTED_COLOR,
    opacity: FROSTED_OPACITY,
  },
  frostedFog: {
    backgroundColor: FROSTED_FOG_COLOR,
    opacity: FROSTED_FOG_OPACITY,
  },
});

export default React.memo(GradientBackgroundShared);
