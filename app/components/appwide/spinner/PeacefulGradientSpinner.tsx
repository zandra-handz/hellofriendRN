import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";
import manualGradientColors from "@/app/styles/StaticColors";
import { View, StyleSheet } from "react-native";
import React from "react";
import LoadingPage from "./LoadingPage";
// import { useUserSettings } from "@/src/context/UserSettingsContext";

//  import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
 
type Props = {
  isInitializing: boolean;
};

const PeacefulGradientSpinner = ({
  userId,
  isInitializing,
  loadingSettings,
}: Props) => { 

  const { isLoading } = useFriendListAndUpcoming({ userId: userId });

  return (
    <>
      {(isInitializing || isLoading || loadingSettings) && (
        <View style={styles.container}>
          <View style={[StyleSheet.absoluteFillObject, {}]}>
            <GradientBackgroundFidgetOne
              firstColorSetDark={manualGradientColors.darkColor}
              firstColorSetLight={manualGradientColors.lightColor}
              speed={8000}
              secondColorSetDark={manualGradientColors.darkColor}
              secondColorSetLight={manualGradientColors.lightColor}
              //  direction="horizontal"
            >
              <LoadingPage
                loading={true}
                label={"loading Hellofriend"}
                includeLabel={true}
                labelColor={manualGradientColors.lightColor}
                color={manualGradientColors.lightColor}
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
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default PeacefulGradientSpinner;
