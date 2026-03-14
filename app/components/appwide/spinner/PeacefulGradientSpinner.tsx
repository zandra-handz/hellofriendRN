 
// import manualGradientColors from "@/app/styles/StaticColors";
import { View, StyleSheet } from "react-native";
import React from "react";
// import LoadingPage from "./LoadingPage"; 
 
// import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming"; 

type Props = {
  isInitializing: boolean;
};

const PeacefulGradientSpinner = ({
  userId,
  isInitializing,
  loadingSettings,
}: Props) => { 
  // const { isLoading } = useFriendListAndUpcoming({ userId: userId });

  return (
    <>
      <View style={styles.container}>
      {/* {(isInitializing || isLoading || loadingSettings) && (
      
          <View style={StyleSheet.absoluteFillObject}>
 
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
          </View>
      
      )} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
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
