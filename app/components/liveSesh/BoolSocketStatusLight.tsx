import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  peerJoinedStatusSV: SharedValue<boolean>;
  size?: number;
  label?: string;
  labelColor?: string;
};

const BoolSocketStatusLight = ({
  peerJoinedStatusSV,
  size = 12,
  label,
  labelColor = "#ffffff",
}: Props) => {
  const dotStyle = useAnimatedStyle(() => {
    const backgroundColor = peerJoinedStatusSV?.value
      ? manualGradientColors.lightColor
      : "#888888";
    return { backgroundColor };
  }, []);

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          dotStyle,
        ]}
      />
      {label ? (
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default BoolSocketStatusLight;
