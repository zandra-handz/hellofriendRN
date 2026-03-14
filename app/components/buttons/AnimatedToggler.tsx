import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  useAnimatedStyle,
} from "react-native-reanimated";

const SHADOW_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_R = 1;

type Props = {
  labelA: string;
  labelB: string;
  fontStyle: any;
  iconAName: string;
  iconBName: string;
  colorA: string;
  colorB: string;
  rotationAtoB?: number | null;
  timing: number;
  valueAB: boolean;
  onPressA: () => void;
  onPressB: () => void;
};

type Slot = {
  opacity: Animated.SharedValue<number>;
  labelOpacity: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  iconScale: Animated.SharedValue<number>;
  rotation: Animated.SharedValue<number>;
};

const AnimatedToggler = ({
  labelA,
  labelB,
  fontStyle,
  iconAName,
  iconBName,
  colorA,
  colorB,
  rotationAtoB,
  timing,
  valueAB,
  onPressA,
  onPressB,
}: Props) => {
  const rot = rotationAtoB ?? 0;
  const rotateDuration = rot ? timing : 0;

  const a: Slot = {
    opacity:      useSharedValue(valueAB ? 0 : 1),
    labelOpacity: useSharedValue(valueAB ? 0 : 1),
    scale:        useSharedValue(valueAB ? 0.85 : 1),
    iconScale:    useSharedValue(valueAB ? 0 : 1),
    rotation:     useSharedValue(0),
  };

  const b: Slot = {
    opacity:      useSharedValue(valueAB ? 1 : 0),
    labelOpacity: useSharedValue(valueAB ? 1 : 0),
    scale:        useSharedValue(valueAB ? 1 : 0.85),
    iconScale:    useSharedValue(valueAB ? 1 : 0),
    rotation:     useSharedValue(0),
  };

  React.useEffect(() => {
    if (valueAB) {
      a.rotation.value = withTiming(rot, { duration: rotateDuration });
      a.iconScale.value = withDelay(rotateDuration, withTiming(0, { duration: timing }));
      a.labelOpacity.value = withDelay(rotateDuration, withTiming(0, { duration: timing }));
      a.opacity.value = withDelay(rotateDuration + timing, withTiming(0, { duration: timing }));
      a.scale.value = withDelay(rotateDuration + timing, withTiming(0.85, { duration: timing }));

      b.opacity.value = withDelay(rotateDuration + timing, withTiming(1, { duration: timing }));
      b.scale.value = withDelay(rotateDuration + timing, withTiming(1, { duration: timing }));
      b.iconScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(rotateDuration + timing, withTiming(1, { duration: timing })),
      );
      b.rotation.value = withSequence(
        withTiming(rot, { duration: 0 }),
        withDelay(rotateDuration + timing, withTiming(0, { duration: timing })),
      );
      b.labelOpacity.value = withDelay(rotateDuration + timing * 2, withTiming(1, { duration: timing }));
    } else {
      b.opacity.value = withTiming(0, { duration: timing });
      b.labelOpacity.value = withTiming(0, { duration: timing });
      b.iconScale.value = withTiming(0, { duration: timing });
      b.scale.value = withTiming(0.85, { duration: timing });

      a.opacity.value = withDelay(timing, withTiming(1, { duration: timing / 4 }));
      a.scale.value = withDelay(timing, withTiming(1, { duration: timing / 4 }));
      a.iconScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(timing, withTiming(1, { duration: timing / 4 })),
      );
      a.rotation.value = withSequence(
        withTiming(rot, { duration: 0 }),
        withDelay(timing, withTiming(0, { duration: rotateDuration })),
      );
      a.labelOpacity.value = withDelay(timing + rotateDuration, withTiming(1, { duration: timing }));
    }
  }, [valueAB]);

  const aWrapperStyle = useAnimatedStyle(() => ({
    opacity: a.opacity.value,
    transform: [{ scale: a.scale.value }],
  }));
  const aIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${a.rotation.value}deg` }, { scale: a.iconScale.value }],
  }));
  const aLabelStyle = useAnimatedStyle(() => ({ opacity: a.labelOpacity.value }));

  const bWrapperStyle = useAnimatedStyle(() => ({
    opacity: b.opacity.value,
    transform: [{ scale: b.scale.value }],
  }));
  const bIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${b.rotation.value}deg` }, { scale: b.iconScale.value }],
  }));
  const bLabelStyle = useAnimatedStyle(() => ({ opacity: b.labelOpacity.value }));

  const renderLabel = (label: string, color: string, animStyle: any) => (
    <View style={styles.labelContainer}>
      <Animated.Text style={[styles.label, fontStyle, { color: OUTLINE_COLOR, position: "absolute", left: -OUTLINE_R }, animStyle]}>{label}</Animated.Text>
      <Animated.Text style={[styles.label, fontStyle, { color: OUTLINE_COLOR, position: "absolute", left: OUTLINE_R }, animStyle]}>{label}</Animated.Text>
      <Animated.Text style={[styles.label, fontStyle, { color: OUTLINE_COLOR, position: "absolute", top: -OUTLINE_R }, animStyle]}>{label}</Animated.Text>
      <Animated.Text style={[styles.label, fontStyle, { color: OUTLINE_COLOR, position: "absolute", top: OUTLINE_R }, animStyle]}>{label}</Animated.Text>
      <Animated.Text style={[styles.label, fontStyle, { color: SHADOW_COLOR, position: "absolute", top: 3 }, animStyle]}>{label}</Animated.Text>
      <Animated.Text style={[styles.label, fontStyle, { color }, animStyle]}>{label}</Animated.Text>
    </View>
  );

  return (
    <Pressable onPress={valueAB ? onPressB : onPressA}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, aWrapperStyle]}>
          <Animated.View style={aIconStyle}>
            <View style={styles.iconShadow}>
              <SvgIcon name={iconAName} size={24} color={colorA} />
            </View>
          </Animated.View>
          {renderLabel(labelA, colorA, aLabelStyle)}
        </Animated.View>

        <Animated.View style={[styles.overlay, bWrapperStyle]}>
          <Animated.View style={bIconStyle}>
            <View style={styles.iconShadow}>
              <SvgIcon name={iconBName} size={24} color={colorB} />
            </View>
          </Animated.View>
          {renderLabel(labelB, colorB, bLabelStyle)}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    gap: 4,
    flexDirection: "row",
  },
  labelContainer: {
    marginLeft: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  iconShadow: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.95,
    shadowRadius: 1,
    elevation: 4,
  },
});

export default React.memo(AnimatedToggler);