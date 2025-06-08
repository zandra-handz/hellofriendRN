import React from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import ReloadList from "@/app/components/helloes/ReloadList";
import { useRoute } from "@react-navigation/native";

const ScreenReload = () => {
    const route = useRoute();
    const savedMoments = route.params?.items ?? [];

    // use: navigation.navigate("ScreenReload", { dataArray: myArray });
  const { capsuleList, preAdded } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle(); 

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
  
        {loadingNewFriend && (
          <View style={{ flex: 1, width: "100%" }}>
            <LoadingPage
              loading={true}
              spinnerSize={30}
              spinnerType={"flow"}
              color={themeStyles.primaryBackground.backgroundColor}
            />
          </View>
        )}
        {selectedFriend && !loadingNewFriend && (
          <>
            <GlobalAppHeader
              //title={"MOMENTS: "}
              title={""}
              navigateTo={"Moments"}
              icon={LeavesTwoFallingOutlineThickerSvg}
              altView={false}
              altViewIcon={LeafSingleOutlineThickerSvg}
            />

            <View style={{ flex: 1 }}>{preAdded && <ReloadList items={savedMoments}  />}</View>
          </>
        )} 
    </SafeViewAndGradientBackground>
  );
};

export default ScreenReload;
