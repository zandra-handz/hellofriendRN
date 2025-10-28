import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Defs, Filter, FeDropShadow, Path } from "react-native-svg";

export default function CrescentMoon({ size = 1000, color = "#fff" }) {
  return (
    <View style={styles.crescentMoon}>
      <Svg viewBox="0 0 24 24" width={size} height={size}>
        <Defs>
          <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow
              dx="2"
              dy="4"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.4"
            />
          </Filter>
        </Defs>
        <Path
          d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z"
          fill={color}
          filter="url(#shadow)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  crescentMoon: {
    position: "absolute",
    top: -190,
    left: -293,
    zIndex: 1,
    transform: [{ rotate: "270deg" }, { scaleX: -1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});
