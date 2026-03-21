import { Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
} from "react-native-reanimated";

import useAppNavigations from "@/src/hooks/useAppNavigations";

type Props = {
  label: string;
  fontStyle?: any;
  color: string;
  timing: number;
  visible: boolean;
  showLabel?: boolean;
  iconSize?: number;
  onPress: () => void;
};

const BackButton = ({ label, fontStyle, color, timing, visible, showLabel=false, iconSize=22, onPress }: Props) => {
  const { navigateBack } = useAppNavigations();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const iconScale = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withDelay(timing, withTiming(1, { duration: timing }));
      scale.value = withDelay(timing, withTiming(1, { duration: timing }));
      iconScale.value = withDelay(timing, withTiming(1, { duration: timing }));
    } else {
      opacity.value = withTiming(0, { duration: timing });
      scale.value = withTiming(0.85, { duration: timing });
      iconScale.value = withTiming(0, { duration: timing });
    }
  }, [visible]);

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Pressable onPress={onPress ? onPress : navigateBack}>
      <Animated.View style={[styles.container, wrapperStyle]}>
        <Animated.View style={iconStyle}>
          <SvgIcon name="chevron_left" size={iconSize} color={color} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",  
    height: 40,
    width: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default BackButton;