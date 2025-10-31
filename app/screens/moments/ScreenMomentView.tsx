import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
// import useFriendDash from "@/src/hooks/useFriendDash";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
import { useCategories } from "@/src/context/CategoriesContext";
// import useCategories from "@/src/hooks/useCategories";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
import SvgIcon from "@/app/styles/SvgIcons";
const ScreenMomentView = () => {
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;

  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { userCategories } = useCategories();
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

  const categoryColorsMap = useMemo(() => {
    if (
      userCategories?.length > 0 &&
      selectedFriend?.lightColor &&
      selectedFriend?.darkColor
    ) {
      return generateGradientColorsMap(
        userCategories,
        selectedFriend.lightColor,
        selectedFriend.darkColor
      );
    }
    return null;
  }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  useEffect(() => {
    if (preAddMomentMutation.isSuccess) {
      showFlashMessage(`Success!`, false, 1000);
    }
  }, [preAddMomentMutation.isSuccess]);

  const TIME_SCORE = 100;

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <GradientBackgroundBreathing
          secondColorSetDark={selectedFriend.lightColor}
          secondColorSetLight={selectedFriend.darkColor} 
          firstColorSetDark={selectedFriend.lightColor}
          firstColorSetLight={selectedFriend.darkColor} 
          timeScore={TIME_SCORE}
          speed={3000}
          style={{ flexDirection: "column", justifyContent: "flex-end" }}
          direction={"vertical"}
        ></GradientBackgroundBreathing>
      </View>
      <View style={{ position: "absolute", top: -170, left: -300 }}>
        <SvgIcon
          name={"leaf"}
          size={1000} 
          color={selectedFriend.lightColor}
          style={{ 
            flexDirection: "row",
            justifyContent: "flex-start",
            zindex: 4000, 
            position: "absolute",
            opacity: 0.6, 
          }}
        />
      </View>

      {selectedFriend?.id && !loadingDash && capsuleList?.length && categoryColorsMap && (
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
