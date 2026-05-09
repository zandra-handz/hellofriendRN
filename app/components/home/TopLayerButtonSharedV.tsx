 
import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import FadeDisappear from "../moments/FadeDisappear";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";

/* =========================
   HELPERS
========================= */

const ICON_OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const ICON_OUTLINE_R = 1;

const getLuminance = (hex: string) => {
  const c = hex.replace("#", "");

  const rgb = [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ].map((v) => {
    const s = v / 255;

    return s <= 0.03928
      ? s / 12.92
      : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const getContrastRatio = (colorA: string, colorB: string) => {
  const lumA = getLuminance(colorA);
  const lumB = getLuminance(colorB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
};

const pickReadableColor = ({
  background,
  lightColor,
  darkColor,
}: {
  background: string;
  lightColor: string;
  darkColor: string;
}) => {
  const lightContrast = getContrastRatio(background, lightColor);
  const darkContrast = getContrastRatio(background, darkColor);

  return lightContrast >= darkContrast ? lightColor : darkColor;
};

const OutlinedSvgIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.iconOutlineLayer, { left: -ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { left: ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { top: -ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { top: ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <SvgIcon name={name} color={color} size={size} />
    </View>
  );
};

/* =========================
   COMPONENT
========================= */

type Props = {
  onPress: () => void;
  iconName: string;
  backgroundColorValue: SharedValue<string>;
  spaceFromBottom?: number;
  hidden?: boolean;
  hideTiming?: number;
  colorTransitionTiming?: number;
};

const AnimatedGlobalPressable =
  Animated.createAnimatedComponent(GlobalPressable);

const TopLayerButtonSharedV = ({
  onPress,
  iconName = "draw_pen",
  backgroundColorValue,
  spaceFromBottom = 80,
  hidden = false,
  hideTiming = 200,
  colorTransitionTiming = 300,
}: Props) => {
  const lightIconColor = manualGradientColors.manualLightTextColor;
  const darkIconColor = manualGradientColors.manualDarkTextColor;

  const [resolvedIconColor, setResolvedIconColor] = useState(() =>
    pickReadableColor({
      background: backgroundColorValue.value,
      lightColor: lightIconColor,
      darkColor: darkIconColor,
    })
  );

  const updateIconColorFromBackground = (currentBackground: string) => {
    setResolvedIconColor(
      pickReadableColor({
        background: currentBackground,
        lightColor: lightIconColor,
        darkColor: darkIconColor,
      })
    );
  };

  useAnimatedReaction(
    () => backgroundColorValue.value,
    (currentBackground, previousBackground) => {
      if (currentBackground === previousBackground) return;
      runOnJS(updateIconColorFromBackground)(currentBackground);
    },
    [lightIconColor, darkIconColor]
  );

  const animatedColor = useDerivedValue(() => {
    return withTiming(backgroundColorValue.value, {
      duration: colorTransitionTiming,
    });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value,
  }));

  const shouldUseIconOutline = resolvedIconColor === lightIconColor;

  return (
    <FadeDisappear
      value={hidden}
      containerStyle={styles.fadeWrapper}
      timing={hideTiming}
    >
      <View style={[styles.wrapper, { bottom: spaceFromBottom }]}>
        <AnimatedGlobalPressable
          onPress={onPress}
          style={[styles.container, animatedStyle]}
        >
          {shouldUseIconOutline ? (
            <OutlinedSvgIcon
              name={iconName}
              color={resolvedIconColor}
              size={25}
            />
          ) : (
            <SvgIcon name={iconName} color={resolvedIconColor} size={25} />
          )}
        </AnimatedGlobalPressable>
      </View>
    </FadeDisappear>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 20,
    zIndex: 99999,
    elevation: 99999,
  },
  fadeWrapper: {
    zIndex: 9,
  },
  container: {
    height: 30,
    width: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 5000,
  },
  iconOutlineLayer: {
    position: "absolute",
  },
});

export default React.memo(TopLayerButtonSharedV);