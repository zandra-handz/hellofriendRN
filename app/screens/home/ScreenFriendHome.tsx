//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useCallback } from "react";

import { useRoute } from "@react-navigation/native";

import { useSharedValue } from "react-native-reanimated";

// app state
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";

import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";

import useUser from "@/src/hooks/useUser";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";

import SelectedFriendHome from "@/app/components/home/SelectedFriendHome";

import { useFriendCategoryColors } from "@/src/context/FriendCategoryColorsContext";

import manualGradientColors from "@/app/styles/StaticColors";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

import TopLayerButton from "@/app/components/home/TopLayerButton";

const ScreenFriendHome = ({ skiaFontLarge, skiaFontSmall }) => {
  const { user } = useUser();

  //FOR SOME REASON SETTINGS UPDATE DOESN'T GET BATCHED WITH OTHER THINGS RENDERING
  //MAYBE TOO MUCH ON THIS SCREEN TO RENDER???? ???????
  const route = useRoute();
  const { friendCategoryColors } = useFriendCategoryColors();
  const idToSelect = route?.params?.idToSelect ?? null;
  const friendName = route?.params?.friendName ?? null;
  const friendNextDate = route?.params?.friendNextDate ?? null;
  const friendChangeTimestamp = route?.params?.friendChangeTimestamp ?? null;
  const { selectedFriend } = useSelectedFriend();

  const backdropTimestamp = route.params?.backdropTimestamp ?? null;

  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user?.id });
  const friendList = friendListAndUpcoming?.friends;

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList,
  });

  // In ScreenFriendHome or wherever the backdrop lives
  const coloredDotsModeValue = useSharedValue(false);
  const turnBackdropOnValue = useSharedValue(false);

  // Select friend when screen mounts with idToSelect param
  useEffect(() => {
    if (idToSelect && friendList?.length && !selectedFriend?.id) {
      console.log("laaaaaaaaaaaaaaaaa");
      handleSelectFriend(idToSelect);
    }
  }, [idToSelect, friendList?.length, selectedFriend?.id]);

  // const { upcomingHelloes  } = useUpcomingHelloes();
  const { navigateToMomentFocus, navigateToMoments, navigateToGecko } =
    useAppNavigations();

  const reverseOverlayValue = useSharedValue(false);

  const handleNavigateToGecko = useCallback(() => {
    reverseOverlayValue.value = true;
    navigateToGecko();
  }, [navigateToGecko]);

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({
      screenCameFrom: 1,
      prevScreenBackdrop: coloredDotsModeValue.value,
    });
    // setTimeout(() => {
    turnBackdropOnValue.value = true;
    // }, 50);
  }, [navigateToMomentFocus]);

  const upcomingHelloes = friendListAndUpcoming?.upcoming;

  useEffect(() => {
    if (backdropTimestamp) {
      turnBackdropOnValue.value = false;
      reverseOverlayValue.value = false;
    }
  }, [backdropTimestamp]);

  const handleMomentScreenNoScroll = useCallback(() => {
    turnBackdropOnValue.value = true;
    navigateToMoments({ scrollTo: null });
  }, [navigateToMoments]);

  const handleToggleColoredDots = () => {
    coloredDotsModeValue.value = !coloredDotsModeValue.value;
  };

  const { lightDarkTheme } = useLDTheme();

 
  const PADDING_HORIZONTAL = 6;

  return (
    <>
      {friendListAndUpcomingIsSuccess && user?.id && (
        <SafeViewFriendHome
          friendColorLight={selectedFriend.lightColor}
          friendColorDark={selectedFriend.darkColor}
          backgroundOverlayColor={lightDarkTheme.primaryBackground}
          friendId={selectedFriend?.id}
          reverseOverlayValue={reverseOverlayValue}
        >
        

          {upcomingHelloes?.length && user?.id && (
            <SelectedFriendHome
              canvasKey={route.key}
              friendName={friendName}
              friendNextDate={friendNextDate}
              friendChangeTimestamp={friendChangeTimestamp}
              primaryBackground={lightDarkTheme.primaryBackground}
              darkGlassBackground={lightDarkTheme.darkGlassBackground}
              darkerGlassBackground={lightDarkTheme.darkerGlassBackground}
              categoryColorsArray={friendCategoryColors}
              skiaFontLarge={skiaFontLarge}
              skiaFontSmall={skiaFontSmall}
              paddingHorizontal={PADDING_HORIZONTAL}
              userId={user?.id}
              primaryColor={lightDarkTheme.primaryText}
              primaryOverlayColor={lightDarkTheme.overlayBackground}
              friendLightColor={selectedFriend?.lightColor}
              friendDarkColor={selectedFriend?.darkColor}
              selectedFriendId={selectedFriend?.id}
              selectedFriendName={selectedFriend?.name}
              handleToggleColoredDots={handleToggleColoredDots}
              coloredDotsModeValue={coloredDotsModeValue}
              handleMomentScreenNoScroll={handleMomentScreenNoScroll} // center double press
              handleNavigateToGecko={handleNavigateToGecko} // new center single press
            />
          )}

          <AnimatedBackdrop
            color={lightDarkTheme.backdropColor}
            zIndex={5}
            isVisibleValue={coloredDotsModeValue}
          />

          <AnimatedBackdrop
            color={lightDarkTheme.backdropColor}
            zIndex={5}
            isVisibleValue={turnBackdropOnValue}
          />

          {selectedFriend?.id && (
            <TopLayerButton
              onPress={handleNavigateToCreateNew}
              backgroundColor={manualGradientColors.lightColor}
              iconColor={manualGradientColors.homeDarkColor}
              spaceFromBottom={120}
              hidden={false}
            />
          )}

          <SelectedFriendFooter
            userId={user?.id}
            friendName={selectedFriend?.name}
            
            lightDarkTheme={lightDarkTheme}
            overlayColor={lightDarkTheme.overlayBackground}
            friendLightColor={selectedFriend?.lightColor}
            friendDarkColor={selectedFriend?.darkColor}
            handleNavigateToGecko={handleNavigateToGecko}
          />
        </SafeViewFriendHome>
      )}
    </>
  );
};

export default ScreenFriendHome;
