import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
import { useCategories } from "@/src/context/CategoriesContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";

import manualGradientColors from "@/app/styles/StaticColors";

const ScreenMomentView = () => {
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;

  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { userCategories } = useCategories();
  const { themeAheadOfLoading } = useFriendStyle();
  // const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();

  const { preAddMomentMutation } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { friendDash, loadingDash } = useFriendDash();

  const phoneNumber = friendDash?.suggestion_settings?.phone_number || null;
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  // useEffect(() => {
  //   if (
  //     userCategories?.length > 0 &&
  //     themeAheadOfLoading?.lightColor &&
  //     themeAheadOfLoading?.darkColor
  //   ) {
  //     setCategoryColorsMap(
  //       generateGradientColorsMap(
  //         userCategories,
  //         themeAheadOfLoading.lightColor,
  //         themeAheadOfLoading.darkColor
  //       )
  //     );
  //   }
  // }, [userCategories, themeAheadOfLoading]);

  const categoryColorsMap = useMemo(() => {
    if (
      userCategories?.length > 0 &&
      themeAheadOfLoading?.lightColor &&
      themeAheadOfLoading?.darkColor
    ) {
      return generateGradientColorsMap(
        userCategories,
        themeAheadOfLoading.lightColor,
        themeAheadOfLoading.darkColor
      );
    }
    return null;
  }, [userCategories, themeAheadOfLoading]);

  useEffect(() => {
    if (preAddMomentMutation.isSuccess) {
      showFlashMessage(`Success!`, false, 1000);
    }
  }, [preAddMomentMutation.isSuccess]);

  const TIME_SCORE = 100;

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <GradientBackgroundBreathing
          secondColorSetDark={themeAheadOfLoading.lightColor}
          secondColorSetLight={themeAheadOfLoading.darkColor}
          // firstColorSetDark={manualGradientColors.lightColor}
          // firstColorSetLight={themeAheadOfLoading.darkColor}
          firstColorSetDark={themeAheadOfLoading.lightColor}
          firstColorSetLight={themeAheadOfLoading.darkColor}
          // firstColorSetDark={manualGradientColors.lightColor}
          // firstColorSetLight={manualGradientColors.darkColor}
          timeScore={TIME_SCORE}
          speed={3000}
          style={{ flexDirection: "column", justifyContent: "flex-end" }}
          direction={"vertical"}
        ></GradientBackgroundBreathing>
      </View>
      <View style={{ position: "absolute", top: -200, left: -300 }}>
        <MaterialCommunityIcons
          name={"leaf"}
          size={1000}
          // color={manualGradientColors.lightColor}
           color={themeAheadOfLoading.lightColor}
          style={{
            // top: -100,
            // left: -100,
            flexDirection: "row",
            justifyContent: "flex-start",
            zindex: 4000,
            // flex: 1,
            position: "absolute",
            // top: -340,
            // left: -310,
            opacity: 0.6,
            // transform: [{ rotate: "0deg" }, { scaleX: 1 }],
          }}
        />
      </View>

      {selectedFriend && !loadingDash && capsuleList && categoryColorsMap && (
        <CarouselSliderMoments
          lightDarkTheme={lightDarkTheme}
          userId={user?.id}
          friendId={selectedFriend?.id}
          initialIndex={currentIndex}
          categoryColorsMap={categoryColorsMap}
          data={capsuleList}
          children={MomentViewPage}
          friendNumber={phoneNumber}
        />
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentView;
