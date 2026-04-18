import { View, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  socketStatusSV: SharedValue<"connected" | "connecting" | "disconnected" | string>;
  size?: number;
};

const SocketStatusLight = ({ socketStatusSV, size = 12 }: Props) => {
  const dotStyle = useAnimatedStyle(() => {
    const status = socketStatusSV.value;
    const backgroundColor =
      status === "connected"
        ? manualGradientColors.lightColor
        : status === "connecting"
          ? "#f39c12"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
  },
});

export default SocketStatusLight;
