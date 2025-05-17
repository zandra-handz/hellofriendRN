import { View, StyleSheet, Animated, Dimensions } from "react-native";
import React from "react";
import LargeMomentLeaf from "@/app/assets/svgs/LargeMomentLeaf";
import SmallMomentLeaf from "@/app/assets/svgs/SmallMomentLeaf";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const { width: screenWidth } = Dimensions.get("window");

const MomentLeavesUI = ({
  fillColor,
  strokeColor,
  smallLeafSize = 60,
  largeLeafSize = 120,
  height = 200,
  flipHorizontally = false,
  opacity = 1,
}) => {
  const { themeStyles } = useGlobalStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          opacity,
          transform: [{ scaleX: flipHorizontally ? -1 : 1 }],
        },
      ]}
    >
      <View style={styles.row}>
         <View style={[styles.leafWrapper, {  }]}>
          <SmallMomentLeaf
            fill={fillColor}
            stroke={strokeColor}
            height={smallLeafSize}
            width={smallLeafSize * 0.6}
            strokeWidth={3}
          />
        </View>
      <View style={[styles.leafWrapper, {  }]}>
          <LargeMomentLeaf
            fill={fillColor}
            stroke={strokeColor}
            height={largeLeafSize}
            width={largeLeafSize * 0.6}
            strokeWidth={3}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    paddingHorizontal: 0,
    zIndex: 0,
    flexDirection: 'row', 
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  leafWrapper: {
    flexShrink: 1,
    maxWidth: "50%", // Prevents overflow
    alignItems: "center",
    justifyContent: "center",
  //  padding: 4,
  },
});

export default MomentLeavesUI;
