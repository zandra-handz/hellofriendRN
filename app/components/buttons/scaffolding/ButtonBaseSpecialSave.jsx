import React from "react";
import { Pressable, Text, StyleSheet, Image, View } from "react-native";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const ButtonBaseSpecialSave = ({
  manualGradientColors,
  primaryColor,
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
  labelPaddingHorizontal = 10,
  borderColor = "transparent",
  borderRadius = 10,
  borderBottomLeftRadius = 10,
  borderBottomRightRadius = 10,
  borderTopRightRadius = 0,
  borderTopLeftRadius = 0,
  isDisabled = true,
}) => {
  const {   appFontStyles } = useGlobalStyle();

  return (
    <Pressable
      onPress={isDisabled ? null : onPress}
      style={[
        styles.container,
        {
          // borderColor: borderColor,
          borderRadius: borderRadius,
          // borderBottomLeftRadius: borderBottomLeftRadius,
          // borderBottomRightRadius: borderBottomRightRadius,
          // borderTopRightRadius: borderTopRightRadius,
          // borderTopLeftRadius: borderTopLeftRadius,
          height: height,   
      
        
        },
      ]}
    >
      {/* <LinearGradient
        colors={[
          isDisabled ? "gray" : manualGradientColors.darkColor,
          isDisabled ? "gray" : manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      /> */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: labelPlacement,
          textAlign: "center",
          alignItems: "center",
          height: "100%",
          width: 100,
          right: 0, 
bottom: 0,
          flex: 1,
          position: "absolute",
          top: imagePositionVertical,
          right: imagePositionHorizontal,
          borderRadius: borderRadius - dynamicPadding,
          borderBottomLeftRadius: borderBottomLeftRadius - dynamicPadding,
          borderBottomRightRadius: borderBottomRightRadius - dynamicPadding,
          borderTopRightRadius: borderTopRightRadius - dynamicPadding,
          borderTopLeftRadius: borderTopLeftRadius - dynamicPadding,
         // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
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
      </View>
      <View
        style={{
          Width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Text
          style={[ 
            appFontStyles.welcomeText,
            {
              color: primaryColor || 'hotpink',
              fontSize: 20,
              lineHeight: 20,
              fontFamily: "Poppins-Bold",
              color: manualGradientColors?.homeDarkColor || 'orange',
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
        
            appFontStyles.subWelcomeText,
            {
              color: primaryColor || 'hotpink',
              fontSize: 14,
              fontFamily: "Poppins-Bold",
              color: manualGradientColors?.homeDarkColor || 'orange',
            },
          ]}
        >
          Close
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
  //  borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    overflow: "hidden",
    zIndex: 5000,
    elevation: 5000,
    
  },
});

export default ButtonBaseSpecialSave;
