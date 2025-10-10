import { View, Text } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
// import useDoublePress from "../buttons/useDoublePress";
import manualGradientColors  from "@/app/styles/StaticColors";
import { FontAwesome6 } from "@expo/vector-icons";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import { Vibration } from "react-native";

type Props = {
  onSinglePress: () => void;
  onDoublePress: () => void;
  size: number;

  borderRadius: number;
};

const GeckoGoButton = ({
  onSinglePress,
  onDoublePress,
  size=60,

  borderRadius=10,
}: Props) => {
  // const { handleDoublePress } = useDoublePress({
  //   onSinglePress: onSinglePress,
  //   onDoublePress: onDoublePress,

  // });

  const onLongPressVibrate = () => {
    Vibration.vibrate(100); 
    onDoublePress();

  };

  return (
    <GlobalPressable
      // onPress={navigateToMoments}
      // onPress={handleDoublePress}
      onLongPress={onLongPressVibrate}
      onPress={onSinglePress}
      style={{ 
        padding: 10,

        backgroundColor: manualGradientColors.lightColor,
        justifyContent: "center",
        borderRadius: borderRadius,
        padding: 0,
        width: size,
        minWidth: size, 
        height: size, 

        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          opacity: 0.9,
          position: "absolute",
          top: -62,
          right: 6,
          transform: [{ rotate: "90deg" }],
        }}
      >
        <GeckoSolidSvg
          width={144}
          height={144}
          color={manualGradientColors.homeDarkColor}
          style={{ opacity: 1 }}
        />
      </View>
      <View
        style={{
          bottom: 0,
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          left: 6,
        }}
      >
        <Text
          style={{
            color: manualGradientColors.homeDarkColor,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          GO{" "}
        </Text>
        <FontAwesome6
          name={"arrow-right"}
          size={20}
          color={manualGradientColors.homeDarkColor}
        />
      </View>
    </GlobalPressable>
  );
};

export default GeckoGoButton;
