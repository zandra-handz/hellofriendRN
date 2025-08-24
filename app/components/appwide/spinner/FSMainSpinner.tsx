import { View } from "react-native";
import React  from "react";  
import GradientBackground from "../display/GradientBackground"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "./LoadingPage";
type Props = {};

const FSMainSpinner = ({
 
  isInitializing,
 
}: Props) => { 

  const { isLoading } = useUpcomingHelloes();

  const { themeAheadOfLoading } = useFriendStyle();

  const { selectedFriend } = useSelectedFriend();
 
  return (
    <> 
      {(
         
        isInitializing ||
        isLoading) && (
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
          <GradientBackground
            useFriendColors={!!selectedFriend?.id}
            startColor={ "#a0f143"} // manualGradientColors.lightColor
            endColor={ "#4caf50"} // manualGradientColors.darkColor
            friendColorDark={themeAheadOfLoading.darkColor}
            friendColorLight={themeAheadOfLoading.lightColor}
          >
            <LoadingPage
              loading={true}
              label={"Just a moment"}
              spinnerType="circle"
              spinnerSize={40}
              color={
                isInitializing
                  ? "hotpink"
                  : isLoading
                    ? "cyan"
                    : "#000002" // manualGradientColors.homeDarkColor
              }
            />
          </GradientBackground>
        </View>
      )}
    </>
  );
};

export default FSMainSpinner;
