// components/AnimatedTogglerBig.tsx
import React, { useCallback } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";
import FadeDisappear from "../moments/FadeDisappear";

const DEFAULT_SHADOW_COLOR = "rgba(0,0,0,0.95)";
const DEFAULT_OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_R = 1;

interface Props {
  onPress: () => void;
  backgroundColor?: string;
  colorA: string;
  colorB: string;
  iconAName?: string;
  iconBName?: string;
  labelA?: string;
  labelB?: string;
  labelSide?: "left" | "right" | "top" | "bottom";
  valueAB: boolean;
  timing?: number;
  hidden?: boolean;
  hideTiming?: number;
  shadowColorA?: string;
  shadowColorB?: string;
  outlineColorA?: string;
  outlineColorB?: string;
}

const AnimatedTogglerBig: React.FC<Props> = ({
  onPress,
  backgroundColor = "transparent",
  colorA,
  colorB,
  iconAName = "close",
  iconBName = "close",
  labelA,
  labelB,
  labelSide = "right",
  valueAB,
  timing = 200,
  hidden,
  hideTiming = 200,
  shadowColorA = DEFAULT_SHADOW_COLOR,
  shadowColorB = DEFAULT_SHADOW_COLOR,
  outlineColorA = DEFAULT_OUTLINE_COLOR,
  outlineColorB = DEFAULT_OUTLINE_COLOR,
}) => {
  const pressScale = useSharedValue(1);

  // --- slot A ---
  const aOpacity      = useSharedValue(valueAB ? 0 : 1);
  const aLabelOpacity = useSharedValue(valueAB ? 0 : 1);
  const aScale        = useSharedValue(valueAB ? 0.85 : 1);
  const aIconScale    = useSharedValue(valueAB ? 0 : 1);

  // --- slot B ---
  const bOpacity      = useSharedValue(valueAB ? 1 : 0);
  const bLabelOpacity = useSharedValue(valueAB ? 1 : 0);
  const bScale        = useSharedValue(valueAB ? 1 : 0.85);
  const bIconScale    = useSharedValue(valueAB ? 1 : 0);

  React.useEffect(() => {
    if (valueAB) {
      // A fades out
      aIconScale.value    = withTiming(0, { duration: timing });
      aLabelOpacity.value = withTiming(0, { duration: timing });
      aOpacity.value      = withDelay(timing, withTiming(0, { duration: timing }));
      aScale.value        = withDelay(timing, withTiming(0.85, { duration: timing }));
      // B fades in
      bOpacity.value      = withDelay(timing, withTiming(1, { duration: timing }));
      bScale.value        = withDelay(timing, withTiming(1, { duration: timing }));
      bIconScale.value    = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(timing, withTiming(1, { duration: timing })),
      );
      bLabelOpacity.value = withDelay(timing * 2, withTiming(1, { duration: timing }));
    } else {
      // B fades out
      bOpacity.value      = withTiming(0, { duration: timing });
      bLabelOpacity.value = withTiming(0, { duration: timing });
      bIconScale.value    = withTiming(0, { duration: timing });
      bScale.value        = withTiming(0.85, { duration: timing });
      // A fades in
      aOpacity.value      = withDelay(timing, withTiming(1, { duration: timing / 4 }));
      aScale.value        = withDelay(timing, withTiming(1, { duration: timing / 4 }));
      aIconScale.value    = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(timing, withTiming(1, { duration: timing / 4 })),
      );
      aLabelOpacity.value = withDelay(timing, withTiming(1, { duration: timing }));
    }
  }, [valueAB]);

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.65, { stiffness: 500, damping: 30, mass: 0.5 });
  }, []);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, { stiffness: 600, damping: 30, mass: 0.5 });
  }, []);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const aWrapperStyle = useAnimatedStyle(() => ({
    opacity: aOpacity.value,
    transform: [{ scale: aScale.value }],
  }));
  const aIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: aIconScale.value }],
  }));
  const aLabelStyle = useAnimatedStyle(() => ({ opacity: aLabelOpacity.value }));

  const bWrapperStyle = useAnimatedStyle(() => ({
    opacity: bOpacity.value,
    transform: [{ scale: bScale.value }],
  }));
  const bIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bIconScale.value }],
  }));
  const bLabelStyle = useAnimatedStyle(() => ({ opacity: bLabelOpacity.value }));

  const isVertical = labelSide === "top" || labelSide === "bottom";

  const renderLabel = (label: string, color: string, slotShadowColor: string, slotOutlineColor: string, animStyle: any) => (
    <Animated.View style={animStyle}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, styles.noWrap, { color: slotOutlineColor, position: "absolute", left: -OUTLINE_R }]}>{label}</Text>
        <Text style={[styles.label, styles.noWrap, { color: slotOutlineColor, position: "absolute", left: OUTLINE_R }]}>{label}</Text>
        <Text style={[styles.label, styles.noWrap, { color: slotOutlineColor, position: "absolute", top: -OUTLINE_R }]}>{label}</Text>
        <Text style={[styles.label, styles.noWrap, { color: slotOutlineColor, position: "absolute", top: OUTLINE_R }]}>{label}</Text>
        <Text style={[styles.label, styles.noWrap, { color: slotShadowColor, position: "absolute", top: 3 }]}>{label}</Text>
        <Text style={[styles.label, styles.noWrap, { color }]}>{label}</Text>
      </View>
    </Animated.View>
  );

  const renderIcon = (iconName: string, color: string, slotShadowColor: string, iconStyle: any) => (
    <Animated.View style={iconStyle}>
      <View style={[styles.iconShadow, { shadowColor: slotShadowColor }]}>
        <SvgIcon name={iconName} size={24} color={color} />
      </View>
    </Animated.View>
  );

  const renderSlot = (
    iconName: string,
    color: string,
    label: string | undefined,
    slotShadowColor: string,
    slotOutlineColor: string,
    wrapperStyle: any,
    iconStyle: any,
    labelStyle: any,
    inFlow: boolean,
  ) => {
    const slotStyle = isVertical
      ? inFlow
        ? styles.overlayVerticalInFlow
        : styles.overlayVerticalAbsolute
      : styles.overlay;

    return (
      <Animated.View style={[slotStyle, wrapperStyle]}>
        {labelSide === "right" && renderIcon(iconName, color, slotShadowColor, iconStyle)}
        {labelSide === "top" && label && renderLabel(label, color, slotShadowColor, slotOutlineColor, labelStyle)}
        {(labelSide === "left" || labelSide === "right") && label && renderLabel(label, color, slotShadowColor, slotOutlineColor, labelStyle)}
        {(labelSide === "top" || labelSide === "bottom") && renderIcon(iconName, color, slotShadowColor, iconStyle)}
        {labelSide === "bottom" && label && renderLabel(label, color, slotShadowColor, slotOutlineColor, labelStyle)}
        {labelSide === "left" && renderIcon(iconName, color, slotShadowColor, iconStyle)}
      </Animated.View>
    );
  };

  const button = (
    <View pointerEvents="box-none" style={[styles.closeButtonWrapper, isVertical && styles.closeButtonWrapperVertical]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.closeButton,
          { backgroundColor },
          (labelA || labelB) ? styles.closeButtonWithLabel : styles.closeButtonNoLabel,
          isVertical && styles.closeButtonVertical,
        ]}
      >
        <Animated.View style={[styles.innerContent, isVertical && styles.innerContentVertical, pressStyle]}>
          {renderSlot(iconAName, colorA, labelA, shadowColorA, outlineColorA, aWrapperStyle, aIconStyle, aLabelStyle, !valueAB)}
          {renderSlot(iconBName, colorB, labelB, shadowColorB, outlineColorB, bWrapperStyle, bIconStyle, bLabelStyle, valueAB)}
        </Animated.View>
      </Pressable>
    </View>
  );

  if (hidden !== undefined) {
    return (
  <FadeDisappear
    value={hidden}
    timing={hideTiming}
    zIndex={100}
    containerStyle={styles.fadeWrapper}
    disablePointerEventsWhenHidden
  >
        {button}
      </FadeDisappear>
    );
  }

  return button;
};

const styles = StyleSheet.create({
  fadeWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  closeButtonWrapper: {
    bottom: 30,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonWrapperVertical: {
    height: "auto",
    minHeight: 60,
  },
  closeButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  closeButtonNoLabel: {
    width: 60,
  },
  closeButtonWithLabel: {
    minWidth: 60,
    paddingHorizontal: 20,
  },
  closeButtonVertical: {
    height: "auto",
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  innerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  innerContentVertical: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  overlayVerticalInFlow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  overlayVerticalAbsolute: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  labelContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  noWrap: {
    flexShrink: 0,
    flexWrap: "nowrap",
  },
  iconShadow: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.95,
    shadowRadius: 1,
    elevation: 4,
  },
});

export default AnimatedTogglerBig;