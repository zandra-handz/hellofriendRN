import React, {  ReactElement, useMemo } from "react";
import {  View, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
 
 

type Props = {
  children: ReactElement;
  style?: StyleProp<ViewStyle>;
};

// this is for overlay components (FlashMessage), hence transparent background
const PlainSafeView = ({
  children,
  style,   
}: Props) => {
  const insets = useSafeAreaInsets();
 

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;
 
  const paddingStyle = useMemo(
    () => ({
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      backgroundColor: "transparent",
    }),
    [top, bottom, left, right]
  );

 

  return (
    <View pointerEvents="box-none" style={[paddingStyle, style]}
    >
   
 
  

      {children}
    </View>
  );
};

export default PlainSafeView;
