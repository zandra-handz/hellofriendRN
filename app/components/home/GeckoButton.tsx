import { View, Text, Pressable } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

type Props = {
  onPress: () => void;
};

const GeckoButton = ({ onPress }: Props) => {
  const { manualGradientColors } = useGlobalStyle();
  return (
    <Pressable
      // onPress={navigateToMoments}
      onPress={onPress}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: manualGradientColors.lightColor,
        justifyContent: "center",
        borderRadius: 10,
        padding: 4,
        width: "auto",
        minWidth: 50,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          opacity: 0.9,
          position: "absolute",
          top: -60,
          right: 0,
          transform: [{ rotate: "90deg" }],
        }}
      >
        <GeckoSolidSvg
          width={140}
          height={140}
          color={manualGradientColors.homeDarkColor}
          style={{ opacity: 1 }}
        />
      </View>
      <View
        style={{
          bottom: -1,
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          left: 2,
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
    </Pressable>
  );
};

export default GeckoButton;
