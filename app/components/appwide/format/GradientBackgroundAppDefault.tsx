import React, { useMemo } from "react";
import { DimensionValue, StyleSheet } from "react-native";
import GradientBackgroundStatic from "../display/GradientBackgroundStatic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screenGradients } from "@/app/styles/GradientDirections";

type Props = {
  children: React.ReactNode;
  style: object;
  includeCustomStatusBar?: boolean;
  includeBackgroundOverlay?: boolean;
  primaryBackground?: boolean;
  backgroundOverlayHeight?: DimensionValue;
  backgroundOverlayBottomRadius?: number;
};

export const GradientBackgroundAppDefault = ({
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
    }),
    [top, bottom, left, right],
  );

  return (
    <GradientBackgroundStatic
      additionalStyles={[paddingStyle, style, styles.container]}
      direction={screenGradients.default}
    >
      {children}
    </GradientBackgroundStatic>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
});

export default GradientBackgroundAppDefault;
