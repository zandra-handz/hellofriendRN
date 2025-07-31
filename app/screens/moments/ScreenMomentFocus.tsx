import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView";
import { useCategories } from "@/src/context/CategoriesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import TopBar from "./TopBar";
const ScreenMomentFocus = () => {
  const route = useRoute();
  const momentText = route.params?.momentText ?? null;
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const { capsuleList } = useCapsuleList();

  const { userCategories } = useCategories();
  const { themeAheadOfLoading } = useFriendList();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const [catCreatorVisible, setCatCreatorVisible] = useState(false);

  const handleOpenCatCreator = () => {
    console.log("cat creator now visible!");
    setCatCreatorVisible(true);
  };

  const handleCloseCatCreator = () => {
    setCatCreatorVisible(false);
  };

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
      setCategoryColorsMap(
        generateGradientColorsMap(
          userCategories,
          themeAheadOfLoading.lightColor,
          themeAheadOfLoading.darkColor
        )
      );
    }
  }, [userCategories, themeAheadOfLoading]);

  return (
    <SafeViewAndGradientBackground styles={{ flex: 1 }}>
      {!catCreatorVisible && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={{ zIndex: 60000 }}
        >
          <TopBar onPress={handleOpenCatCreator} />
        </Animated.View>
      )}
      {categoryColorsMap && (
        <Animated.View
          entering={SlideInDown}
          style={{ width: "100%", flex: 1 }}
        >
          <MomentWriteEditView
            catCreatorVisible={catCreatorVisible}
            closeCatCreator={handleCloseCatCreator}
            categoryColorsMap={categoryColorsMap}
            momentText={momentText || null}
            updateExistingMoment={updateExistingMoment}
            existingMomentObject={existingMomentObject}
          />
        </Animated.View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentFocus;
