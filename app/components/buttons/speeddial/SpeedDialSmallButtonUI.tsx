import React from "react";
import { View, TouchableOpacity, StyleSheet, DimensionValue } from "react-native";
import { SvgProps } from "react-native-svg";

interface SpeedDialSmallButtonUIProps {
  containerWidth: DimensionValue | undefined;
  circleSize: number;
  icon: React.FC<SvgProps>;
  iconSize: number;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}

const SpeedDialSmallButtonUI: React.FC<SpeedDialSmallButtonUIProps> = ({
  containerWidth = 73,
  circleSize = 70,
  icon: Icon,
  iconSize = 40,
  iconColor = "gray",
  backgroundColor = "black",
  onPress = () =>
    console.warn("Warning! No function passed to SpeedDialSmallButtonUI press"),
}) => {
  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.circleButton,
          {
            width: circleSize,
            height: circleSize,
            borderColor: iconColor,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {Icon && <Icon width={iconSize} height={iconSize} color={iconColor} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,

    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f",
  },
});

export default SpeedDialSmallButtonUI;
