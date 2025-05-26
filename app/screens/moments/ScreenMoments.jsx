import React from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeView from "@/app/components/appwide/format/SafeView";
import MomentsList from "@/app/components/moments/MomentsList";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";

const ScreenMoments = () => {
  const { capsuleList } = useCapsuleList();

  return (
    <SafeView style={{ flex: 1 }}>
      <GradientBackground useFriendColors={true}>
        <GlobalAppHeader
          title={"MOMENTS: "}
          navigateTo={"Moments"}
          icon={LeavesTwoFallingOutlineThickerSvg}
          altView={false}
          altViewIcon={LeafSingleOutlineThickerSvg}
        />
        <View style={{ flex: 1 }}>{capsuleList && <MomentsList />}</View>
      </GradientBackground>
    </SafeView>
  );
};

export default ScreenMoments;
