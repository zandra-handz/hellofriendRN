import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";
//
type Props = {
  onPress: () => void;
  backgroundColor: string;
  iconColor: string;
  spaceFromBottom: number;
};

const WriteButton = ({
  onPress,
  backgroundColor = "orange",
  iconColor,
  spaceFromBottom = 80,
}: Props) => {
  return (
    <View style={[styles.wrapper, { bottom: spaceFromBottom }]}>
      <GlobalPressable
        onPress={onPress}
        style={[styles.container, { backgroundColor: backgroundColor }]}
      >
                <SvgIcon 
          name={"draw_pen"} 
          //   name={"pen_plus"} 
          color={iconColor} size={40} />
        {/* <GradientBackgroundFidgetOne
          //   speed={600} what the spinner this is based on is set to
          firstColorSetDark={manualGradientColors.darkColor}
          firstColorSetLight={manualGradientColors.lightColor}
          speed={2000}
          secondColorSetDark={manualGradientColors.darkColor}
          secondColorSetLight={manualGradientColors.lightColor}
          // firstSetDirection={direction}
          // secondSetDirection={direction}
          borderRadius={999}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <SvgIcon 
          name={"draw_pen"} 
          //   name={"pen_plus"} 
          color={iconColor} size={40} />
        </GradientBackgroundFidgetOne> */}
      </GlobalPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",

    right: 12,
    zIndex: 99999,
    elevation: 99999,
  },
  container: {
    height: 60,
    width: 60,

    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",

    // ✅ Drop shadow (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 7,
  },
});

export default React.memo(WriteButton);
