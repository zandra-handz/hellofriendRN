import React from "react";
import { View } from "react-native";

import { useCapsuleList } from "@/src/context/CapsuleListContext"; 
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import SafeView from "@/app/components/appwide/format/SafeView";
import MomentsList from "@/app/components/moments/MomentsList";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";


const ScreenMoments = () => {
  const { themeAheadOfLoading } = useFriendList(); 
  const { capsuleList } = useCapsuleList();

  return (
    <SafeView style={{ flex: 1 }}>
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flex: 1,
          width: "100%",
         // left: -1,
          padding: 0,
          justifyContent: "space-between",
        }}
      >
        <GlobalAppHeader title={"MOMENTS: "} navigateTo={"Moments"} icon={LeavesTwoFallingOutlineThickerSvg} altView={false} altViewIcon={LeafSingleOutlineThickerSvg} />
        <View style={{ flex: 1 }}>{capsuleList && <MomentsList />}</View>
      </LinearGradient>
    </SafeView>
  );
}; 

export default ScreenMoments;
