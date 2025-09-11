import React, { useEffect,  useMemo } from "react";
import { useUser } from "@/src/context/UserContext";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
import { useCategories } from "@/src/context/CategoriesContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext"; 
const ScreenMomentView = () => {
  const route = useRoute();
 

  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { userCategories } = useCategories();
  const currentIndex = route.params?.index ?? null;
  const { themeAheadOfLoading } = useFriendStyle();
  // const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();


  

  const { preAddMomentMutation  } = usePreAddMoment({
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

  return (
    <SafeViewAndGradientBackground 
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      {selectedFriend &&
        !loadingDash &&
        capsuleList &&
        categoryColorsMap && (
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
