import { View, Text, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
// import useDoublePress from "../buttons/useDoublePress";
import manualGradientColors from "@/app/styles/StaticColors";

import SvgIcon from "@/app/styles/SvgIcons";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import { Vibration } from "react-native";

type Props = {
  onSinglePress: () => void;
  onDoublePress: () => void; 
};

const GeckoGoButton = ({
  onSinglePress,
  onDoublePress,
 
 
}: Props) => {
  // const { handleDoublePress } = useDoublePress({
  //   onSinglePress: onSinglePress,
  //   onDoublePress: onDoublePress,

  // });



  const onLongPressVibrate = () => {
    Vibration.vibrate(100);
    onDoublePress();
  };

  const flattenedContainerStyle = StyleSheet.flatten(        [styles.container, { 

        backgroundColor: manualGradientColors.lightColor,
      }]
    )

  

  return (
    <GlobalPressable 
      onLongPress={onLongPressVibrate}
      onPress={onSinglePress}
      style={   [styles.container, { 

        backgroundColor: manualGradientColors.lightColor,
      }]}
    >
      <View style={styles.geckoRotateContainer}>
        <GeckoSolidSvg
          width={144}
          height={144}
          color={manualGradientColors.homeDarkColor}
          style={{ opacity: 1 }}
        />
      </View>
      <View style={styles.geckoLabelContainer}>
        <Text
          style={
            {
            color: manualGradientColors.homeDarkColor,
            fontSize: 18,
            fontWeight: "bold",
          }
        }
        >
          GO{" "}
        </Text>
        <SvgIcon
          name={"arrow_right"}
          size={20}
          color={manualGradientColors.homeDarkColor}
        />
      </View>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
            padding: 10,

        justifyContent: "center",
        borderRadius: 10,
        padding: 0,
        width: 60,
        minWidth: 60,
        height: 60,

        overflow: "hidden",

  },
  geckoRotateContainer: {
    position: "absolute",
    opacity: 0.9,
    top: -62,
    right: 6,
    transform: [{ rotate: "90deg" }],
  },
  geckoLabelContainer: {
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    left: 6,
  },
});

export default GeckoGoButton;
