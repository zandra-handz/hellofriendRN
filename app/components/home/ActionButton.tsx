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
  labelColor: string;
  spaceFromBottom: number;
  label: string;
  iconName: string;
};

const ActionButton = ({
  onPress,
  backgroundColor = "orange",
  iconColor,
  labelColor = 'orange',
  iconName = 'plus',
 
  label,
}: Props) => {
  return (
    <View style={[styles.wrapper ]}>
      <GlobalPressable
        onPress={onPress}
        style={[styles.container, { backgroundColor: backgroundColor }]}
      >
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
        > */}
          <SvgIcon name={iconName} color={iconColor} size={30} />
       
        {/* </GradientBackgroundFidgetOne> */}
      </GlobalPressable>
      <View style={styles.labelWrapper}>


         <Text style={[styles.label, {color: labelColor}]}>
            {label}
          </Text>
                </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // position: "absolute",
    alignItems: 'center',

    // right: 12,
    zIndex: 99999,
    elevation: 99999,
  },
  container: {
    height: 50,
    width: 50,

    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",

  
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 7,
  },
  labelWrapper: {
    paddingVertical: 6,

  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,

  },
});

export default React.memo(ActionButton);
