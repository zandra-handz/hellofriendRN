import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
//import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useNavigation } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";
import StaticBackdrop from "@/app/components/appwide/format/StaticBackdrop";


import { useFriendCategoryColors } from "@/src/context/FriendCategoryColorsContext";
import { useSharedValue, withTiming } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
// import { useFriendList } from "@/src/context/FriendListContext";
import FadeDisappear from "@/app/components/moments/FadeDisappear";
import TopLayerButton from "@/app/components/home/TopLayerButton";
import TopLayerButtonSharedV from "@/app/components/home/TopLayerButtonSharedV";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
// import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// import LoadingCircle from "@/app/components/appwide/spinner/LoadingCircle";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { AppFontStyles } from "@/app/styles/AppFonts";

const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route?.params?.scrollTo ?? null;
  const { lightDarkTheme } = useLDTheme();
  const navigation = useNavigation();
  const { user } = useUser();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { friendCategoryColorsMap } = useFriendCategoryColors();
  const { capsuleList, preAdded } = useCapsuleList();

  const prevScreenHasBackdrop = route.params?.prevScreenBackdrop ?? false;

  const [categoryNavigatorVisible, setCategoryNavigatorVisible] =
    useState(false);

  const handleToggleCatNav = () => {
    setCategoryNavigatorVisible((prev) => !prev);
  };
  const topCategoryColor = useSharedValue(manualGradientColors.lightColor); // default color

  const ActivateBackdrop = useSharedValue(prevScreenHasBackdrop ? 1 : 0);

  useEffect(() => {
    if (!prevScreenHasBackdrop) {
      ActivateBackdrop.value = withTiming(1, { duration: 600 });
    }
  }, []);

  const { handlePreAddMoment } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { categoryNames, categoryStartIndices } = useTalkingPCategorySorting({
    listData: capsuleList,
  });

  const {
    navigateToMomentView,
    navigateToMomentFocus,
    navigateToFinalize,
    navigateBack,
    navigateToFriendHome,
  } = useAppNavigations();
  const TIME_SCORE = 100;

  const { friendListAndUpcoming, isLoading } = useFriendListAndUpcoming({
    userId: user?.id,
  });

  // const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const { userCategories } = useCategories({ userId: user?.id });
  // const { friendList } = useFriendList();

  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  // const upcomingId = friendListAndUpcoming?.next?.id;
  const welcomeTextStyle = AppFontStyles.welcomeText;

  const { loadingDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
  // const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList: friendList,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      unsubscribe(); // remove listener first to prevent loop
      navigateToFriendHome(null, Date.now());
    });
    return unsubscribe;
  }, [navigation]);

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1, prevScreenBackdrop: true });
  }, [navigateToMomentFocus]);

  const handleSelectUpNext = () => {
    const { id, name } = upcomingHelloes[0].friend;
    handleSelectFriend(id);
  };

  // BUG this will let selected friend override, it needs to be able to know if navigating here from quick actions
  useEffect(() => {
    if (loadingDash || isLoading) {
      return;
    }

    if (
      selectedFriend ||
      friendList.length === 0 ||
      upcomingHelloes.length === 0
    ) {
      return;
    }

    handleSelectUpNext();
  }, [selectedFriend, loadingDash, isLoading, friendList, upcomingHelloes]);

  //flow has changed so do we want to do this here still?
  // this should be inside something? it keeps rerendering when I toggle the categories now that I'm passing that state down
  //commented out 2/28/2026
  // prefetchUserAddresses();
  // prefetchFriendAddresses();

  // useEffect(() => {
  //   if (
  //     selectedFriend?.lightColor &&
  //     selectedFriend?.darkColor &&
  //     userCategories &&
  //     userCategories.length > 0
  //   ) {
  //     setCategoryColorsMap(
  //       generateGradientColorsMap(
  //         userCategories,
  //         selectedFriend.lightColor,
  //         selectedFriend.darkColor,
  //       ),
  //     );
  //   }
  // }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  return (
    <SafeViewFriendHome
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
    >
      {/* <AnimatedBackdrop
        color={lightDarkTheme.backdropColor}
        zIndex={0}
        isVisibleValue={ActivateBackdrop}
      /> */}

      <StaticBackdrop
        color={lightDarkTheme.backdropColor}
        zIndex={0}
        isVisibleValue={ActivateBackdrop}
        startsVisible={!!selectedFriend?.id}
      />

      <TextHeader
        label={`All notes`}
        color={lightDarkTheme.primaryText}
        fontStyle={welcomeTextStyle}
        showNext={true}
        nextEnabled={true}
        nextIconName={`arrow_right`}
        onNext={navigateToFinalize}
        nextColor={lightDarkTheme.primaryText}
        nextBackgroundColor={'transparent'}
      />

      {selectedFriend && !loadingDash && (
        <>
          <View style={{ flex: 1 }}>
            {capsuleList && friendCategoryColorsMap && (
              <MomentsList
                topCategoryColorValue={topCategoryColor}
                capsuleList={capsuleList}
                preAdded={preAdded}
                updateCapsule={handlePreAddMoment}
                categoryNames={categoryNames}
                categoryStartIndices={categoryStartIndices}
                navigateToMomentView={navigateToMomentView}
                darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
                lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
                // EscortBarMinusWidth
                navigateBack={navigateBack}
                // Moment item
                friendColor={selectedFriend.darkColor}
                primaryBackgroundColor={lightDarkTheme.primaryBackground}
                primaryColor={lightDarkTheme.primaryText}
                primaryOverlayColor={lightDarkTheme.overlayBackground}
                friendId={selectedFriend?.id}
                scrollToIndex={scrollTo}
                categoryColorsMap={friendCategoryColorsMap}
                handleNavigateToCreateNew={handleNavigateToCreateNew}
                categoryNavigatorVisible={categoryNavigatorVisible}
                handleToggleCatNav={handleToggleCatNav}
              />
            )}
          </View>
        </>
      )}
      {selectedFriend?.id && (
        <TopLayerButton
          iconName={`draw_pen`}
          onPress={handleNavigateToCreateNew}
          backgroundColor={manualGradientColors.lightColor}
          iconColor={manualGradientColors.homeDarkColor}
          hidden={categoryNavigatorVisible}
          spaceFromBottom={120}
        />
      )}
      {selectedFriend?.id && (
        <TopLayerButtonSharedV
          iconName="rose_compass" 
          onPress={handleToggleCatNav}
          backgroundColorValue={topCategoryColor}
          colors={
            Object.values(friendCategoryColorsMap).length > 1
              ? Object.values(friendCategoryColorsMap)
              : [
                  manualGradientColors.lightColor,
                  manualGradientColors.lightColor,
                ]
          } // fallback with 2 values
          iconColor={manualGradientColors.homeDarkColor}
          hidden={categoryNavigatorVisible}
          spaceFromBottom={44}
        />
      )}
    </SafeViewFriendHome>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default ScreenMoments;
