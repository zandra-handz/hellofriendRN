import { View, StyleSheet } from "react-native"; 
import React from "react";
import LargeMomentLeaf from "@/app/assets/svgs/LargeMomentLeaf";
import SmallMomentLeaf from "@/app/assets/svgs/SmallMomentLeaf";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const MomentLeavesUI = ({
  index,
  // fillColor,
  // strokeColor,
  // smallLeafSize = 400,
  // largeLeafSize = 420,
  height = 200,
}) => {

     const { gradientColors, gradientColorsHome } = useGlobalStyle();
  return (

   
    <View
      style={[
        {
          width: "100%",
          position: "absolute",
          paddingHorizontal: 0,
          zIndex: 0,
          flexDirection: "row",
          height,
          transform: [{ scaleX: index % 2 === 0 ? -1 : 1 }],
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",  
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <View style={styles.leafWrapper}>
          <SmallMomentLeaf
            fill={gradientColorsHome.darkColor}
            stroke={gradientColors.darkColor}
            height={420}
            width={420 * 0.6}
            strokeWidth={3}
          />
        </View>
        <View style={styles.leafWrapper}>
          <LargeMomentLeaf
            fill={gradientColorsHome.darkColor}
            stroke={gradientColors.darkColor}
            height={400}
            width={400 * 0.6}
            strokeWidth={3}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 
  leafWrapper: {
    flexShrink: 1,
    maxWidth: "50%", 
    alignItems: "center",
    justifyContent: "center",
   
  },
});

export default MomentLeavesUI;
