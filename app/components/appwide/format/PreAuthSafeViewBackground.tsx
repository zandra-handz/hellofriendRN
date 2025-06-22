import React, { useMemo } from "react";
import { View } from "react-native";
import CustomStatusBar from "../statusbar/CustomStatusBar";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 

export const PreAuthSafeViewBackground = ({
  children,
  style,
  includeCustomStatusBar = true, 
  primaryBackground = false, 
  header: Header,
}) => { 

  const standardizedHeaderHeight = 44;

  const { themeStyles } = useGlobalStyle();

 

  const paddingStyle = useMemo(
    () => ({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: primaryBackground
        ? themeStyles.primaryBackground.backgroundColor
        : "transparent",
    }),
    [primaryBackground, themeStyles]
  );

  return (
    <View
      style={[ paddingStyle, style, {
        flex: 1,
        // justifyContent: "space-between",
        width: "100%",
      }]}
    >
      {includeCustomStatusBar && <CustomStatusBar />}
      {Header && (
        <View style={{ height: standardizedHeaderHeight }}>
          <Header />
        </View>
      )}
      {children}
    </View>
  );
};

export default PreAuthSafeViewBackground;
