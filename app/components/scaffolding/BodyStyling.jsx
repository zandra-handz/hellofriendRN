import React from "react";
import { View } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

const BodyStyling = ({
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
}) => {
  const { themeStyles, appContainerStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  return (
    <View
      style={[
        appContainerStyles.bodyContainer,
        // themeStyles.genericTextBackground,
        {
          
          backgroundColor: transparentBackground
            ? "transparent"
            : themeStyles.genericTextBackground.backgroundColor,
          width: width,
          height: height,
          minHeight: minHeight,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingHorizontal: paddingHorizontal,
          borderWidth: borderWidth,
          borderColor: transparentBorder
          ? "transparent" 
          : themeAheadOfLoading.lightColor,
        },
      ]}
    >
      {children && children}
    </View>
  );
};
 

export default BodyStyling;
