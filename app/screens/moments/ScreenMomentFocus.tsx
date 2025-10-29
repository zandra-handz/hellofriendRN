import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

 

import TinyFlashMessage from "@/app/components/alerts/TinyFlashMessage";

import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import Animated, {
  // SlideInDown,
  // SlideInUp,
  // SlideOutUp,
} from "react-native-reanimated";
import TopBarLikeMinusWidth from "./TopBarLikeMinusWidth";

const ScreenMomentFocus = () => {
  const route = useRoute();
  const { user } = useUser();
  const { settings } = useUserSettings();
  const { lightDarkTheme } = useLDTheme();
  const momentText = route.params?.momentText ?? null;
  const screenCameFrom = route.params?.screenCameFrom ?? 0; // 0 = nav back, 1 = do not nav after save
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const { selectedFriend } = useSelectedFriend();
  const { friendDash } = useFriendDash({userId: user?.id, friendId: selectedFriend?.id});
  const { capsuleList } = useCapsuleList();
  const { userCategories } = useCategories({userId: user?.id}); 
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  // const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const [catCreatorVisible, setCatCreatorVisible] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState<number>(0);

  const PADDING_HORIZONTAL = 6; //same as homme/selected friend screens

  //using this arrangement below to keep top and bottom bar spacing the same :)
  const CARD_PADDING = 4;
  const SPACER_BETWEEN_BAR_AND_CARD = 2; // low bc there is already parent padding
  const topBarHeight = 50;

  const topBarTotalHeight = topBarHeight;

  const handleOpenCatCreator = () => {
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

  // useEffect(() => {
  //   if (userCategories && userCategories.length > 0) {
  //     setCategoryColorsMap(
  //       generateGradientColorsMap(
  //         userCategories,
  //         selectedFriend.lightColor,
  //         selectedFriend.darkColor
  //       )
  //     );
  //   }
  // }, [userCategories, selectedFriend]);

  const categoryColorsMap = useMemo(() => {
    if (
      userCategories?.length &&
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
  }, [userCategories, selectedFriend]);

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      addColorChangeDelay={true}
      forceFullOpacity={true}
      useSolidOverlay={false}
      useOverlayFade={false}
      backgroundOverlayHeight={"10%"}
      includeBackgroundOverlay={catCreatorVisible}
      styles={{ flex: 1 }}
    >
      {!catCreatorVisible && (
        <Animated.View
          // entering={SlideInUp}
          // exiting={SlideOutUp}
          style={{
            height: topBarTotalHeight,
            zIndex: 60000,
            paddingHorizontal: PADDING_HORIZONTAL,
          }}
        >
          <TopBarLikeMinusWidth
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            forwardFlowOn={false}
            // marginTop={topBarMarginTop}
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
          // entering={SlideInDown}
          style={{
            width: "100%",
            flex: 1,
            marginTop: SPACER_BETWEEN_BAR_AND_CARD,
          }}
        >
          <MomentWriteEditView
            paddingHorizontal={PADDING_HORIZONTAL}
            defaultCategory={settings?.user_default_category}
            manualGradientColors={manualGradientColors}
            capsuleList={capsuleList}
            friendId={selectedFriend?.id}
            friendName={selectedFriend?.name}
            userId={user?.id}
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
            darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
                        themeColors={{
              lightColor: selectedFriend.lightColor,
              darkColor: selectedFriend.darkColor,
              fontColor: selectedFriend.fontColor,
              fontColorSecondary: selectedFriend.fontColorSecondary,
            }}  
            friendFaves={friendDash?.friend_faves}
            screenCameFromToParent={screenCameFrom}
            triggerSaveFromLateral={triggerSaveFromLateral}
            catCreatorVisible={catCreatorVisible}
            openCatCreator={handleOpenCatCreator}
            closeCatCreator={handleCloseCatCreator}
            categoryColorsMap={categoryColorsMap}
            momentText={momentText}
            updateExistingMoment={updateExistingMoment}
            existingMomentObject={existingMomentObject}
            escortBarSpacer={SPACER_BETWEEN_BAR_AND_CARD + CARD_PADDING}
            cardPaddingVertical={CARD_PADDING}
          />
        </Animated.View>
      )}
      <TinyFlashMessage triggerMessage={triggerMessage} />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentFocus;
