import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const ScreenMomentFocus = () => {
  const route = useRoute();
  const momentText = route.params?.momentText ?? null;
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, loadingNewFriend  } = useSelectedFriend();

  const renderHeader = useCallback(() => (
        <GlobalAppHeader
          title={"WRITE MOMENT: "}
          navigateTo={"Moments"}
          altView={true}
          altViewIcon={LeafSingleOutlineThickerSvg}
        />
), [selectedFriend, loadingNewFriend, themeAheadOfLoading]);
  

  return (
    <SafeViewAndGradientBackground header={renderHeader} styles={{ flex: 1 }}>
   

        <MomentWriteEditView
          momentText={momentText || null}
          updateExistingMoment={updateExistingMoment}
          existingMomentObject={existingMomentObject}
        /> 
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenMomentFocus;
