import React from "react";
import { View, StyleSheet } from "react-native";
 

const BodyStyling = ({
  backgroundColor, //themeStyles.primaryBackground.backgroundColor
  friendLightColor, // themeAheadOfLoading.lightColor
  height = "100%",
  width = "100%",
  minHeight = "96%",
  paddingTop = "6%",
  paddingBottom = "0%",
  paddingHorizontal = "0%",
  borderWidth = 0,
  transparentBackground = false,
  transparentBorder = false,
  children,
  justifyContent = 'space-between',
}) => { 

  return (
    <View
      style={[
        styles.bodyContainer,
        // themeStyles.genericTextBackground,
        {
          justifyContent: justifyContent,
          backgroundColor: transparentBackground
            ? "transparent"
            : backgroundColor,
          width: width,
          height: height,
          minHeight: minHeight,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingHorizontal: paddingHorizontal,
          borderWidth: borderWidth,
          borderColor: transparentBorder
          ? "transparent" 
          : friendLightColor,
        },
      ]}
    >
      {children && children}
    </View>
  );
};

const styles = StyleSheet.create({
  
  bodyContainer: {
    alignContent: "center",
    alignSelf: "center",
    borderWidth: 0,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // borderRadius: 30,
    flexDirection: "column",
    zIndex: 1,
    elevation: 1,
  },
});
 

export default BodyStyling;
