import React, { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
import { useCategories } from "@/src/context/CategoriesContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
const ScreenMomentView = () => {
  const route = useRoute();
  const moment = route.params?.moment ?? null;

  const { user } = useUser();
    const { selectedFriend  } = useSelectedFriend();
  const { userCategories } = useCategories();
  const currentIndex = route.params?.index ?? null;
  const { themeAheadOfLoading } = useFriendStyle();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
const { themeStyles, manualGradientColors } = useGlobalStyle();
  const {
    capsuleList,  
  } = useCapsuleList();

 

  const { preAddMomentMutation, updateCacheWithNewPreAdded } = usePreAddMoment({userId: user?.id, friendId: selectedFriend?.id})

  // const [currentIndex, setCurrentIndex] = useState(0);

  const { loadingDash } = useFriendDash();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  useEffect(() => {
    if (
      userCategories?.length > 0 &&
      themeAheadOfLoading?.lightColor &&
      themeAheadOfLoading?.darkColor
    ) {
      setCategoryColorsMap(
        generateGradientColorsMap(
          userCategories,
          themeAheadOfLoading.lightColor,
          themeAheadOfLoading.darkColor
        )
      );
    }
  }, [userCategories, themeAheadOfLoading]);


 

  useEffect(() => {
    //This runs before capsule list length updates
    if (preAddMomentMutation.isSuccess) {
      console.log('success!!!!!!!!!!!!!!!!!!!!!!');
  showFlashMessage(`Success!`, false, 1000);
    }
  }, [preAddMomentMutation.isSuccess]);



  return (
    <SafeViewAndGradientBackground
    
        startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}style={{ flex: 1 }}>
      {selectedFriend &&
        !loadingDash &&
        capsuleList &&
        categoryColorsMap && 
        themeAheadOfLoading && (
          <CarouselSliderMoments
          userId={user?.id}
          friendId={selectedFriend?.id}
            initialIndex={currentIndex}
            categoryColorsMap={categoryColorsMap}
            data={capsuleList}
            children={MomentViewPage}
          />
        )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentView;
