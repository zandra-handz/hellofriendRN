import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useNavigation } from "@react-navigation/native";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUserSettings from "@/src/hooks/useUserSettings";
import useFriendDash from "@/src/hooks/useFriendDash";
import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";
import TinyFlashMessage from "@/app/components/alerts/TinyFlashMessage";
import { useSharedValue, withTiming } from "react-native-reanimated";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import AnimatedReverseBackdrop from "@/app/components/appwide/format/AnimatedReverseBackdrop";
import StaticBackdrop from "@/app/components/appwide/format/StaticBackdrop";
const ScreenMomentFocus = () => {
  const route = useRoute();
  const { user } = useUser();
  const { settings } = useUserSettings();
  const { lightDarkTheme } = useLDTheme();
  const { navigateToFriendHome } = useAppNavigations();
  const navigation = useNavigation();

  const momentText = route.params?.momentText ?? null;
  const screenCameFrom = route.params?.screenCameFrom ?? 0; // 0 = nav back, 1 = do not nav after save

  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const prevScreenHasBackdrop = route.params?.prevScreenBackdrop ?? false;
  const triggerReverseBackdrop = route.params?.triggerReverseBackdrop ?? false;
  const { selectedFriend } = useSelectedFriend();
  const { friendDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const [catCreatorVisible, setCatCreatorVisible] = useState(false);

  const ActivateBackdrop = useSharedValue(prevScreenHasBackdrop ? 1 : 0);
  const ReverseBackdrop = useSharedValue(triggerReverseBackdrop ? 1 : 0);

  useEffect(() => {
    if (!prevScreenHasBackdrop) {
      ActivateBackdrop.value = withTiming(1, { duration: 600 });
    }
  }, []);

  useEffect(() => {
    if (triggerReverseBackdrop) {
      ReverseBackdrop.value = withTiming(1, { duration: 600 });
    }
  }, []);

  useEffect(() => {
    // wrap in conditional to prevent rerouting when navigating back after using home screen flow
    if (selectedFriend?.id) {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        unsubscribe();

        navigateToFriendHome({backdropTimestamp: Date.now()});
      });
      return unsubscribe;
    }
  }, [navigation, selectedFriend]);

  const [triggerMessage, setTriggerMessage] = useState<number>(0);

  const PADDING_HORIZONTAL = 6; //same as homme/selected friend screens

  //using this arrangement below to keep top and bottom bar spacing the same :)
  const CARD_PADDING = 4;
  const SPACER_BETWEEN_BAR_AND_CARD = 2; // low bc there is already parent padding

  // only used to tell background screen when to turn dark
  const handleOpenCatCreator = () => {
    setCatCreatorVisible(true);
  };

  const handleCloseCatCreator = () => {
    setCatCreatorVisible(false);
  };

  const [triggerSaveFromLateral, setTriggerSaveFromLateral] = useState(false);

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

  return (
    <SafeViewFriendHome
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
    >
      <StaticBackdrop
        color={lightDarkTheme.backdropColor}
        zIndex={0} 
      />

      {triggerReverseBackdrop && (
        <AnimatedReverseBackdrop
          color={lightDarkTheme.primaryBackground}
          isVisibleValue={ReverseBackdrop}
        />
      )}

      <MomentWriteEditView
        paddingHorizontal={PADDING_HORIZONTAL}
        defaultCategory={settings?.user_default_category}
        friendId={selectedFriend?.id}
        friendName={selectedFriend?.name}
        userId={user?.id}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
        lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        darkGlassBackground={lightDarkTheme.darkGlassBackground}
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
        momentText={momentText}
        updateExistingMoment={updateExistingMoment}
        existingMomentObject={existingMomentObject}
        escortBarSpacer={SPACER_BETWEEN_BAR_AND_CARD + CARD_PADDING}
        cardPaddingVertical={CARD_PADDING}
      />

      <TinyFlashMessage triggerMessage={triggerMessage} />
    </SafeViewFriendHome>
  );
};

export default ScreenMomentFocus;
