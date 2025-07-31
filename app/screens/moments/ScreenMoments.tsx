import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import TopBarWithAddMoment from "./TopBarWithAddMoment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import Loading from "@/app/components/appwide/display/Loading";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCategories } from "@/src/context/CategoriesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";
const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route?.params?.scrollTo ?? null;
  const { capsuleList } = useCapsuleList();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const { userCategories } = useCategories();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { navigateToMomentFocus } = useAppNavigations();
  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
  
  
  
  
  prefetchUserAddresses();
  prefetchFriendAddresses();

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

  //     const categoryColorsMap = useMemo(() => {
  //   if (!userCategories || userCategories.length === 0) return {};
  //   return generateGradientColorsMap(
  //     userCategories,
  //     themeAheadOfLoading.lightColor,
  //     themeAheadOfLoading.darkColor
  //   );
  // }, [userCategories, themeAheadOfLoading.lightColor, themeAheadOfLoading.darkColor]);

  return (
    <SafeViewAndGradientBackground 
      backgroundOverlayHeight={120} 
      style={{ flex: 1 }}
    >
      <TopBarWithAddMoment />
      <View
        style={{
          width: "100%",
          zIndex: 1,
          elevation: 1,
          paddingHorizontal: 20,
          alignItems: "center",
          width: "100%", 
          height: 0,
          flexDirection: "column",
          justifyContent: "flex-end",
          marginTop: 0,
        }}
      >
        
      </View>
      <View style={{ width: "100%", height: 4 }}></View>
      <Loading isLoading={loadingNewFriend} />

      {selectedFriend && !loadingNewFriend && (
        <>
          <View style={{ flex: 1 }}>
            {capsuleList && categoryColorsMap && (
              <MomentsList
                scrollTo={scrollTo}
                categoryColorsMap={categoryColorsMap}
              />
            )}
            
          </View>
          
        </>
      )}

    </SafeViewAndGradientBackground>
  );
};

export default ScreenMoments;
