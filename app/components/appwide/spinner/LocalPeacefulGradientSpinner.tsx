import React from "react";
import { View, StyleSheet } from "react-native";

// app components
import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";

// static
import manualGradientColors from "@/app/styles/StaticColors";


import LoadingPage from "./LoadingPage"; 
type Props = {
  loading: boolean;
  label?: string;
};

const LocalPeacefulGradientSpinner = ({ loading, label}: Props) => {
 

  return (
    <>
      {loading && (
        <View
          style={styles.container}
        >
          <View style={StyleSheet.absoluteFillObject}>
            <GradientBackgroundFidgetOne
              firstColorSetDark={manualGradientColors.darkColor}
              firstColorSetLight={manualGradientColors.lightColor}
              speed={600}
              secondColorSetDark={manualGradientColors.darkColor}
              secondColorSetLight={manualGradientColors.lightColor}
              //  direction="horizontal"
            >
              <LoadingPage
                loading={true}
                label={label}
                includeLabel={true}
                labelColor={manualGradientColors.homeDarkColor}
                color={manualGradientColors.homeDarkColor}
                //  color={'transparent'}
                spinnerType={"chase"}
                spinnerSize={40}
              />
            </GradientBackgroundFidgetOne>
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
