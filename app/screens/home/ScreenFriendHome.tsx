
import React, { useEffect, useCallback } from "react";

import { useRoute } from "@react-navigation/native";

import {
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
import DevEnergyButtons from "@/app/components/buttons/DevEnergyButtons";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";
// import useGroqBeta from "@/src/hooks/useGroqBeta";
import useUser from "@/src/hooks/useUser";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";

import SelectedFriendHome from "@/app/components/home/SelectedFriendHome";
import {
  showSpinner,
  hideSpinner,
} from "@/app/components/appwide/button/showSpinner";
import manualGradientColors from "@/app/styles/StaticColors";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

import TopLayerButton from "@/app/components/home/TopLayerButton";
import AnimatedTogglerBig from "@/app/components/alerts/AnimatedTogglerBig";
import { Pressable } from "react-native";
import { showModalMessage } from "@/src/utils/ShowModalMessage";

const ScreenFriendHome = ({
  skiaFontLarge,
  skiaFontSmall,
  shouldDelayAnimation,
}) => {
  const { user } = useUser();

  const [isDelaying, setIsDelaying] = React.useState(
    () => shouldDelayAnimation ?? false,
  );

  useEffect(() => {
    if (!isDelaying) return;
    const timeout = setTimeout(() => setIsDelaying(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const route = useRoute();
 

  const resetTimestamp = route?.params?.resetTimestamp ?? null;
  const idToSelect = route?.params?.idToSelect ?? null;
  const friendNextDate = route?.params?.friendNextDate ?? null;
  const friendChangeTimestamp = route?.params?.friendChangeTimestamp ?? null;
  const { selectedFriend } = useSelectedFriend();

  const backdropTimestamp = route.params?.backdropTimestamp ?? null;

  //   const { askGroq, loading, error } = useGroqBeta();

  // const handlePress = async () => {
  //   const reply = await askGroq(
  //     'You are a friendly assistant.',
  //     'Say hello in three languages.'
  //   );
  //   console.log(reply);
  // };
  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user?.id });
  const friendList = friendListAndUpcoming?.friends;

  const coloredDotsModeValue = useSharedValue(false);
  const turnBackdropOnValue = useSharedValue(false);

  const [coloredDotsMode, setColoredDotsMode] = React.useState(false);

  useDerivedValue(() => {
    runOnJS(setColoredDotsMode)(coloredDotsModeValue.value);
  }, [coloredDotsModeValue]);

  useEffect(() => {
    if (resetTimestamp && coloredDotsModeValue.value) {
      coloredDotsModeValue.value = false;
    }
  }, [resetTimestamp]);

  const { navigateToMomentFocus, navigateToMoments, navigateToGecko } =
    useAppNavigations();

  const reverseOverlayValue = useSharedValue(false);

  const handleNavigateToGecko = useCallback(() => {

    // if (!isAwake) {
    //     showFlashMessage(`Gecko is asleep. Ssssshh!`, false, 1000);
    // }

    reverseOverlayValue.value = true;
    navigateToGecko();
  }, [navigateToGecko]);

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({
      screenCameFrom: 1,
      prevScreenBackdrop: coloredDotsModeValue.value,
    });
    turnBackdropOnValue.value = true;
  }, [navigateToMomentFocus]);

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

  const handleToggleColoredDots = useCallback(() => {
    coloredDotsModeValue.value = !coloredDotsModeValue.value;
  }, []);

  const { lightDarkTheme } = useLDTheme();
  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const overlayColor = lightDarkTheme.overlayBackground;

  const PADDING_HORIZONTAL = 6;

  useEffect(() => {
    if (isDelaying) {
      showSpinner(backgroundColor);
    } else {
      hideSpinner();
    }
  }, [isDelaying, backgroundColor]);

  return (
    <>
      {friendListAndUpcomingIsSuccess && !isDelaying && (
        <SafeViewFriendHome
          friendColorLight={selectedFriend.lightColor}
          friendColorDark={selectedFriend.darkColor}
          backgroundOverlayColor={backgroundColor}
          friendId={selectedFriend?.id}
          reverseOverlayValue={reverseOverlayValue}
        >
          <>
            {/* <Pressable onPress={handlePress} style={{width: 100, top: 230, zIndex: 10, position: 'absolute', height: 50, backgroundColor: 'red'}}>

          </Pressable> */}
            <SelectedFriendHome
              canvasKey={route.key}
              friendName={selectedFriend.name}
              friendId={selectedFriend.id}
              friendNextDate={friendNextDate}
              friendChangeTimestamp={friendChangeTimestamp}
              primaryBackground={lightDarkTheme.primaryBackground}
              darkGlassBackground={lightDarkTheme.darkGlassBackground}
              darkerGlassBackground={lightDarkTheme.darkerGlassBackground}
              skiaFontLarge={skiaFontLarge}
              skiaFontSmall={skiaFontSmall}
              paddingHorizontal={PADDING_HORIZONTAL}
              userId={user.id}
              primaryColor={lightDarkTheme.primaryText}
              primaryOverlayColor={lightDarkTheme.overlayBackground}
              friendLightColor={selectedFriend?.lightColor}
              friendDarkColor={selectedFriend?.darkColor}
              handleToggleColoredDots={handleToggleColoredDots}
              coloredDotsModeValue={coloredDotsModeValue}
              handleMomentScreenNoScroll={handleMomentScreenNoScroll}
              handleNavigateToGecko={handleNavigateToGecko}
            />

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

            <TopLayerButton
              onPress={handleNavigateToCreateNew}
              backgroundColor={manualGradientColors.lightColor}
              iconColor={manualGradientColors.homeDarkColor}
              spaceFromBottom={110}
              hidden={false}
            />

            <AnimatedTogglerBig
              colorA={"transparent"}
              colorB={textColor}
              backgroundColor={overlayColor}
              onPress={handleToggleColoredDots}
              labelA="Back"
              labelB="Back"
              iconAName="chevron_left"
              iconBName="chevron_left"
              valueAB={coloredDotsMode}
              hidden={!coloredDotsMode}
              labelSide={"bottom"}
              hideTiming={10} // disappear fast
              shadowColorB="transparent"
              outlineColorB="transparent"
              shadowColorA="transparent"
              outlineColorA="transparent"
            />
            <DevEnergyButtons/>

            <SelectedFriendFooter
              userId={user.id}
              friendId={selectedFriend?.id}
              friendName={selectedFriend?.name}
              lightDarkTheme={lightDarkTheme}
              overlayColor={lightDarkTheme.overlayBackground}
              friendLightColor={selectedFriend?.lightColor}
              friendDarkColor={selectedFriend?.darkColor}
              handleNavigateToGecko={handleNavigateToGecko}
              hiddenValue={coloredDotsModeValue}
            />
          </>
        </SafeViewFriendHome>
      )}
    </>
  );
};

export default ScreenFriendHome;
