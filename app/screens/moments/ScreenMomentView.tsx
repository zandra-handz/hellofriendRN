import React, { useEffect, useState } from "react";

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
const ScreenMomentView = () => {
  const route = useRoute();
  const moment = route.params?.moment ?? null;
  const { userCategories } = useCategories();
  const currentIndex = route.params?.index ?? null;
  const { themeAheadOfLoading } = useFriendStyle();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
const { themeStyles, manualGradientColors } = useGlobalStyle();
  const {
    capsuleList,
    deleteMomentRQuery,
    updateCapsuleMutation,
    updateCacheWithNewPreAdded,
  } = useCapsuleList();

  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend  } = useSelectedFriend();
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
    if (updateCapsuleMutation.isSuccess) {
      updateCacheWithNewPreAdded(); //The animation in the screen itself triggers this too but after a delay, not sure if I need this here
      //  console.log(`capsule list length after update: ${capsuleList?.length}`);
    }
  }, [updateCapsuleMutation.isSuccess]);

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    try {
      const momentData = {
        friend: selectedFriend.id,
        id: item.id,
      };

      deleteMomentRQuery(momentData);
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  }; 

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
