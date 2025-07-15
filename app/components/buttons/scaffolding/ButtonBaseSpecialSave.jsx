import React from "react";
import { Pressable, Text, StyleSheet, Image, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const ButtonBaseSpecialSave = ({
  onPress,
  label = "ADD NEW IMAGE",
  labelSize = 20,
  height = 60,
  fontFamily = "Poppins-Regular",
  maxHeight = 90,
  imageSize = 90,
  image = require("@/app/assets/shapes/redheadcoffee.png"),
  imagePositionHorizontal = 0,
  imagePositionVertical = 8,
  dynamicPadding = 5,
  labelPlacement = "center",
   labelPaddingHorizontal= 10,
  borderColor = "transparent",
  borderRadius = 10,
  borderBottomLeftRadius = 10,
  borderBottomRightRadius = 10,
  borderTopRightRadius = 0,
  borderTopLeftRadius = 0,
  isDisabled = true,
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  return (
    <Pressable
      onPress={isDisabled ? null : onPress}
      style={[
        styles.container,
        {
          borderColor: borderColor,
          borderRadius: borderRadius,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          borderTopRightRadius: borderTopRightRadius,
          borderTopLeftRadius: borderTopLeftRadius,
          height: height,
          maxHeight: maxHeight,
         padding: dynamicPadding,
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
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: labelPlacement,
          textAlign: "center",
          alignItems: "center", 
          height: "100%",
          borderRadius: borderRadius - dynamicPadding,
          borderBottomLeftRadius: borderBottomLeftRadius - dynamicPadding,
          borderBottomRightRadius: borderBottomRightRadius - dynamicPadding,
          borderTopRightRadius: borderTopRightRadius - dynamicPadding,
          borderTopLeftRadius: borderTopLeftRadius - dynamicPadding,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
        }}
      >
        {image && (
          <Image
            source={image}
            style={{
              position: "absolute",
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
              paddingHorizontal: labelPaddingHorizontal,
           
              fontSize: labelSize,
              color: themeStyles.primaryText.color,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    //  flex: 1,
    width: "100%", 
    alignContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    overflow: "hidden",
    zIndex: 5000,
    elevation: 5000,
  },
});

export default ButtonBaseSpecialSave;
