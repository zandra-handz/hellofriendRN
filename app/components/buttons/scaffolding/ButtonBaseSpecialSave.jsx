import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const ButtonBaseSpecialSave = ({
  onPress,
  label = "ADD NEW IMAGE",
  labelSize = 20,
  height = "100%",
  fontFamily = "Poppins-Regular",
  maxHeight = 90,
  imageSize = 90,
  image = require("@/app/assets/shapes/chatmountain.png"),
  imagePositionHorizontal = 0,
  imagePositionVertical = 8,
  borderColor = "transparent",
  borderRadius = 10, 
  isDisabled = true,
}) => { 

  const { manualGradientColors } = useGlobalStyle();
 
  return (
    <TouchableOpacity
      onPress={isDisabled ? null : onPress}
      style={[
        styles.container,
        {
          borderColor: borderColor,
          borderRadius: borderRadius,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      <LinearGradient
        colors={[
          isDisabled ? "gray" : manualGradientColors.darkColor,
          isDisabled ? "gray" : manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />

      {image && (
        <Image
          source={image}
          style={{
            width: imageSize,
            height: imageSize,
            top: imagePositionVertical,
            right: imagePositionHorizontal,
          }}
          resizeMode="contain"
        />
      )}

      <Text
        style={[ 
          {
            fontFamily: fontFamily,
            textTransform: "uppercase",
            paddingRight: 20,
            fontSize: labelSize,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: "1%",
    paddingRight: "0%",
    alignContent: "center",
    marginVertical: "1%",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    zIndex: 5000,
    elevation: 5000,
  },
});

export default ButtonBaseSpecialSave;
