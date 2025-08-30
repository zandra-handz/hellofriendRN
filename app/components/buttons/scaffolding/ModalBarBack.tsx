import React from "react";
import { Pressable, Text, StyleSheet, Image, View } from "react-native";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GlobalPressable from "../../appwide/button/GlobalPressable";

type Props = {
  onPress: () => void;
  label?: string;
  labelSize?: number;
  height?: number;
  fontFamily?: string;
  maxHeight?: number;
  dynamicPadding?: number;
  labelPlacement?: "start" | "center" | "end"; // is just a justifyContent
  labelPaddingHorizontal?: number;
  borderColor?: string;
  borderRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopRightRadius?: number;
  borderTopLeftRadius?: number;
  isDisabled?: boolean;
  
};

const ModalBarBack = ({
  onPress,
  label = "Close", 
  labelSize = 20,
  height = 60,
  fontFamily = "Poppins-Regular",
  maxHeight = 90,
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
  primaryColor='orange', 
  overlayColor='gray',
}: Props) => { 

  return (
    <GlobalPressable
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
          backgroundColor: overlayColor,
        }}
      >
        <Text
          style={[
            {
              fontFamily: fontFamily,
              paddingHorizontal: labelPaddingHorizontal,

              fontSize: labelSize,
              color: primaryColor,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </GlobalPressable>
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

export default ModalBarBack;
