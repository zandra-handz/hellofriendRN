import { View, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import FadeDisappear from "../moments/FadeDisappear";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
  iconName: string;
  backgroundColorValue: SharedValue<string>;
  iconColor: string;
  spaceFromBottom?: number;
  hidden?: boolean;
  hideTiming?: number;
  colorTransitionTiming?: number;
};

const AnimatedGlobalPressable = Animated.createAnimatedComponent(GlobalPressable);

const TopLayerButtonSharedV = ({
  onPress,
  iconName = "draw_pen",
  backgroundColorValue,
  iconColor,
  spaceFromBottom = 80,
  hidden = false,
  hideTiming = 200,
  colorTransitionTiming = 300,
}: Props) => {
  const animatedColor = useDerivedValue(() => {
    return withTiming(backgroundColorValue.value, { duration: colorTransitionTiming });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value,
  }));

  return (
    <FadeDisappear value={hidden} containerStyle={styles.fadeWrapper} timing={hideTiming}>
      <View style={[styles.wrapper, { bottom: spaceFromBottom }]}>
        <AnimatedGlobalPressable
          onPress={onPress}
          style={[styles.container, animatedStyle]}
        >
          <SvgIcon name={iconName} color={iconColor} size={25} />
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
});

export default React.memo(TopLayerButtonSharedV);