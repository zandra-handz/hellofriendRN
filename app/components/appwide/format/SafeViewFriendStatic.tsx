import React, { useEffect, useState, ReactElement, useMemo } from "react";
import { View, DimensionValue, ViewStyle, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: ReactElement;
  style?: ViewStyle;
  useOverlay: boolean;
  primaryBackground: boolean;
  backgroundOverlayHeight: DimensionValue;
  header?: React.ComponentType;
};

const SafeViewFriendStatic = ({
  children,
  friendColorLight = "white",
  friendColorDark = "red",
  useOverlay = false,
  backgroundOverlayColor = "orange",
  style,
}: Props) => {
  const direction = [0, 0, 0, 1];

  return (
    <SafeAreaView style={[styles.safeAreaStyle, style]}>
      <LinearGradient
        colors={[friendColorLight, friendColorDark]}
        start={{ x: direction[0], y: direction[1] }}
        end={{ x: direction[2], y: direction[3] }}
        style={StyleSheet.absoluteFill}
      />
      {useOverlay && backgroundOverlayColor && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { opacity: 0.4, backgroundColor: backgroundOverlayColor },
          ]}
        />
      )}

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  solidOverlayContainer: {
    position: "absolute",
    zIndex: 0,

    width: "100%",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default SafeViewFriendStatic;
