import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useCategories } from "@/src/context/CategoriesContext"; 
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import TinyFlashMessage from "@/app/components/alerts/TinyFlashMessage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import TopBarLikeMinusWidth from "./TopBarLikeMinusWidth"; 

const ScreenMomentFocus = () => {
  const route = useRoute();
  const { user } = useUser();
  const {lightDarkTheme} = useLDTheme();
  const { appFontStyles, manualGradientColors } = useGlobalStyle();
  const momentText = route.params?.momentText ?? null;
  const screenCameFrom = route.params?.screenCameFrom ?? 0; // 0 = nav back, 1 = do not nav after save
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
 const { selectedFriend } = useSelectedFriend();
 const {   friendDash } = useFriendDash();
  const { capsuleList } = useCapsuleList();
  const { userCategories } = useCategories();
  const { themeAheadOfLoading } = useFriendStyle();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const [catCreatorVisible, setCatCreatorVisible] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState<number>(0);

  // useEffect(() => {
  //   if (updateFriendDefaultCategoryMutation.isSuccess) {
  //     console.log('IS SUCCESS IN SCREEN MOMENT FOCUS');
  //     setTriggerMessage(Date.now())
  //   }

  // }, [updateFriendDefaultCategoryMutation.isSuccess]);


  //using this arrangement below to keep top and bottom bar spacing the same :)
  const CARD_PADDING = 4;
  const SPACER_BETWEEN_BAR_AND_CARD = 2; // low bc there is already parent padding
  const topBarHeight = 50;
  const topBarMarginTop = 10;

  const topBarTotalHeight = topBarHeight + topBarMarginTop;

  const handleOpenCatCreator = () => {
    console.log("cat creator now visible!");
    setCatCreatorVisible(true);
  };

  const handleCloseCatCreator = () => {
    setCatCreatorVisible(false);
  };

  const [triggerSaveFromLateral, setTriggerSaveFromLateral] = useState(false);

  const handleTriggerSaveFromLateral = () => {
    setTriggerSaveFromLateral(true);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (triggerSaveFromLateral) {
      timeout = setTimeout(() => setTriggerSaveFromLateral(false), 0);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [triggerSaveFromLateral]);

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
    <SafeViewAndGradientBackground
        startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground }
      friendId={selectedFriend?.id}
      addColorChangeDelay={true}
      backgroundOverlayHeight={"10%"}
      includeBackgroundOverlay={catCreatorVisible}
      styles={{ flex: 1 }}
    >
      {!catCreatorVisible && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={{ height: topBarTotalHeight, zIndex: 60000 }}
        >
          <TopBarLikeMinusWidth
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          fontStyle={appFontStyles.subWelcomeText}
            forwardFlowOn={false}
            marginTop={topBarMarginTop}
            onExpandPress={handleOpenCatCreator}
            onPress={handleTriggerSaveFromLateral}
            label={""}
            onPressLabel={updateExistingMoment ? "Save" : "Save"}
          />
        </Animated.View>
      )}

      {catCreatorVisible && <View style={{ height: topBarTotalHeight }}></View>}

      {categoryColorsMap && (
        <Animated.View
          entering={SlideInDown}
          style={{
            width: "100%",
            flex: 1,
            marginTop: SPACER_BETWEEN_BAR_AND_CARD,
          }}
        >
          <MomentWriteEditView
          friendId={selectedFriend?.id}
          userId={user?.id}
          primaryColor={lightDarkTheme.primaryText}
          darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
          welcomeTextStyle={appFontStyles.welcomeText}
          friendFaves={friendDash?.friend_faves}
            screenCameFromToParent={screenCameFrom}
            triggerSaveFromLateral={triggerSaveFromLateral}
            catCreatorVisible={catCreatorVisible}
            openCatCreator={handleOpenCatCreator}
            closeCatCreator={handleCloseCatCreator}
            categoryColorsMap={categoryColorsMap}
            momentText={momentText || null}
            updateExistingMoment={updateExistingMoment}
            existingMomentObject={existingMomentObject}
            escortBarSpacer={SPACER_BETWEEN_BAR_AND_CARD + CARD_PADDING}
            cardPadding={CARD_PADDING} 
          />
        </Animated.View>
      )}
      <TinyFlashMessage triggerMessage={triggerMessage} />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentFocus;
