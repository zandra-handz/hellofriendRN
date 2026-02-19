import React, { useMemo } from "react";
import { View, DimensionValue, StyleSheet } from "react-native";
import CustomStatusBar from "../statusbar/CustomStatusBar";
 
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style: object;
  includeCustomStatusBar?: boolean;
  includeBackgroundOverlay?: boolean;
  primaryBackground?: boolean;
  backgroundOverlayHeight?: DimensionValue;
  backgroundOverlayBottomRadius?: number;
};

export const NoGradientBackground = ({
  children,
  style,

  includeCustomStatusBar = true,
  backgroundColor = "transparent",
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
      backgroundColor: backgroundColor,
    }),
    [backgroundColor],
  );

  return (
    <View style={[paddingStyle, style, styles.container]}>
      {/* {includeCustomStatusBar && <CustomStatusBar manualDarkMode={false} />} */}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
 
});

export default NoGradientBackground;
