import { View } from "react-native";
import React  from "react";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
// import SafeViewAndGradientBackground from "../format/SafeViewAndGradBackground";
import GradientBackground from "../display/GradientBackground";


import LoadingPage from "./LoadingPage";
type Props = {};

const FSMainSpinner = (props: Props) => {
  const {  isInitializing, signinMutation  } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { manualGradientColors } = useGlobalStyle(); 



    


  return (
    <> 
    {/* //   {isLoading && ( */}
     {/* //   {loadingNewFriend && ( */}
         {((signinMutation && (signinMutation.isPending || signinMutation.isSuccess)) || isInitializing) && (
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
            backgroundColor: "red",
          }}
        >
          <GradientBackground useFriendColors={!!(selectedFriend)}>
            <LoadingPage
              loading={true} 
              label={"Just a moment"}
              spinnerType="circle"
              spinnerSize={40}
              color={ !isInitializing ? manualGradientColors.homeDarkColor : 'red'}
            />
          </GradientBackground>
        </View>
      )}
    </>
  );
};

export default FSMainSpinner;
