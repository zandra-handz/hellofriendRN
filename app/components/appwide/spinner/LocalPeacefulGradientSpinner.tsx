import React from "react";
import { View, StyleSheet } from "react-native";

// app components - DON'T REMOVE YET
// import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";

// static
import manualGradientColors from "@/app/styles/StaticColors";

import { LinearGradient } from "expo-linear-gradient";
import LoadingPage from "./LoadingPage";
type Props = {
  loading: boolean;
  label?: string;
};

const LocalPeacefulGradientSpinner = ({ loading, label }: Props) => {
  const vertDirection = [[0, 0, 0, 1]];

  return (
    <>
      {loading && (
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFillObject}>
            <LinearGradient
              colors={[
                manualGradientColors.darkColor,
                manualGradientColors.lightColor,
              ]} // or could just do dark dark?
              start={{ x: vertDirection[0], y: vertDirection[1] }}
              end={{ x: vertDirection[2], y: vertDirection[3] }}
              style={[StyleSheet.absoluteFill]}
            />

            {/* <GradientBackgroundFidgetOne
              firstColorSetDark={manualGradientColors.darkColor}
              firstColorSetLight={manualGradientColors.lightColor}
              speed={8000}
              secondColorSetDark={manualGradientColors.darkColor}
              secondColorSetLight={manualGradientColors.lightColor}
              //  direction="horizontal"
            > */}
            <LoadingPage
              loading={true}
              label={label}
              includeLabel={true}
              labelColor={manualGradientColors.homeDarkColor}
              color={manualGradientColors.lightColor}
              //  color={'transparent'}
              spinnerType={"chase"}
              spinnerSize={40}
            />
            {/* </LinearGradient> */}
            {/* </GradientBackgroundFidgetOne> */}
          </View>
        </View>
      )}
    </>
  );
};

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

export default LocalPeacefulGradientSpinner;
