import { View, Text, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import manualGradientColors from "@/app/styles/StaticColors";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import { Vibration } from "react-native";

type Props = {
  onSinglePress: () => void;
  onDoublePress: () => void;
};

const GeckoGoButton = ({ onSinglePress, onDoublePress }: Props) => {
  const onLongPressVibrate = () => {
    Vibration.vibrate(100);
    onDoublePress();
  };

  return (
    <GlobalPressable
      onLongPress={onLongPressVibrate}
      onPress={onSinglePress}
      style={[
        styles.container,
        {
          backgroundColor: manualGradientColors.lightColor,
        },
      ]}
    >
      <View style={styles.geckoRotateContainer}>
        <GeckoSolidSvg
          width={158}
          height={158}
          color={manualGradientColors.homeDarkColor}
          style={{ opacity: 1 }}
        />
      </View>
      <View style={styles.geckoLabelContainer}>
        <Text
          style={{
            color: manualGradientColors.homeDarkColor,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          GO{" "}
        </Text>
      </View>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderRadius: 999,
    width: 70,
    height: 68,
    overflow: "hidden",
  },
  geckoRotateContainer: {
    position: "absolute",
    opacity: 0.9,
    top: -68,
    right: 10,
    transform: [{ rotate: "90deg" }],
  },
  geckoLabelContainer: {
    bottom: 3,
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    left: 20,
  },
});

export default GeckoGoButton;
