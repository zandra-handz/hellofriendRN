import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import Loading from "@/app/components/appwide/display/Loading";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCategories } from "@/src/context/CategoriesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
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
      // includeBackgroundOverlay={true}
      backgroundOverlayHeight={120}
      // backgroundOverlayBottomRadius={20}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <View
          style={[
            themeStyles.primaryBackground,
            {
              paddingHorizontal: 20,
              flexDirection: "row",
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              // justifyContent: 'space-between',
              borderRadius: 10,
              marginVertical: 10,
            },
          ]}
        >
          {/* <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText, {fontSize: 18, fontWeight: 'bold'}]}>Share mode</Text> */}

          <View>
            <Pressable
              onPress={navigateToMomentFocus}
              hitSlop={20}
              style={{ position: "absolute", top: 0, right: -10 }}
            >
              <MaterialCommunityIcons
                name={"plus"}
                size={16}
                color={manualGradientColors.homeDarkColor}
                style={{
                  backgroundColor: manualGradientColors.lightColor,
                  borderRadius: 999,
                }}
              />
            </Pressable>

            <MaterialCommunityIcons
              name="leaf"
              size={26}
              color={themeStyles.primaryText.color}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          zIndex: 1,
          elevation: 1,
          paddingHorizontal: 20,
          alignItems: "center",
          width: "100%",

          // height: 60,
          height: 0,
          flexDirection: "column",
          justifyContent: "flex-end",
          marginTop: 0,
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
          //             padding: 10,
          //     backgroundColor: themeStyles.primaryBackground.backgroundColor,
          //  borderRadius: 10,
       
          }}
        >
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.welcomeText,
             { fontSize: appFontStyles.welcomeText.fontSize - 10,  
             
              },
            ]}
          >
            Share mode
          </Text>
          {/* <LargeThoughtBubble/>  </View> */}
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
