import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";
import manualGradientColors from "@/app/styles/StaticColors";
import { View, StyleSheet } from "react-native";
import React from "react";  
import LoadingPage from "./LoadingPage"; 
import { useUserSettings } from "@/src/context/UserSettingsContext";
//  import useSignIn from "@/src/hooks/UserCalls/useSignIn";

//  import { useUser } from "@/src/context/UserContext";

import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
type Props = {
  isInitializing: boolean;
};

const PeacefulGradientSpinner = ({ isInitializing }: Props) => {
 
  const  {  loadingSettings } = useUserSettings();
 

  const { isLoading} = useFriendListAndUpcoming();
 
 
  return (
    <>
      {(isInitializing || isLoading || loadingSettings) && (
        <View
          style={{
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
          }}
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
                label={'loading Hellofriend'}
                includeLabel={true}
                labelColor={manualGradientColors.homeDarkColor}
                color={manualGradientColors.homeDarkColor}
             //  color={'transparent'}
                 spinnerType={'chase'}
                spinnerSize={40}
              /> 
            </GradientBackgroundFidgetOne>
          </View>
        </View>
      )}
    </>
  );
};

export default PeacefulGradientSpinner;
