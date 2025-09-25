import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";
import manualGradientColors from "@/src/hooks/StaticColors";
import { View, StyleSheet } from "react-native";
import React from "react"; 
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext"; 
import LoadingPage from "./LoadingPage"; 
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useFriendList } from "@/src/context/FriendListContext";
type Props = {
  isInitializing: boolean;
};

const LocalPeacefulGradientSpinner = ({ loading, label='loading' }: Props) => {
  const { isLoading } = useUpcomingHelloes();
  const  { settings, loadingSettings } = useUserSettings();
  const { loadingFriendList } = useFriendList();
 
  return (
    <>
      {(loading) && (
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
                label={loading}
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

export default LocalPeacefulGradientSpinner;
