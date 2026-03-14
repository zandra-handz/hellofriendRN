 
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";
import SpinnerFive from "../button/SpinnerFive";

export type SpinnerHandle = {
  show: (backgroundColor: string) => void;
  hide: () => void;
};
  
const LocalSolidSpinner = forwardRef<SpinnerHandle>((_, ref) => {
  const viewRef = useRef<View>(null);
  const bgViewRef = useRef<View>(null);

  useImperativeHandle(ref, () => ({
    show: (bg: string) => {
      bgViewRef.current?.setNativeProps({ backgroundColor: bg });
      viewRef.current?.setNativeProps({ display: 'flex' });
    },
    hide: () => {
      viewRef.current?.setNativeProps({ display: 'none' });
    },
  }));

  return (
    <View ref={viewRef} style={[styles.container, { display: 'none' }]}>
      <View ref={bgViewRef} style={StyleSheet.absoluteFillObject}>
        <SpinnerFive
          color1={manualGradientColors.lightColor}
          color2={manualGradientColors.darkColor}
        />
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    zIndex: 100000,
    elevation: 100000,
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default LocalSolidSpinner;