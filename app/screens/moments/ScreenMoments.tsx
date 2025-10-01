import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import TopBarWithAddMoment from "./TopBarWithAddMoment"; 
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import { useCategories } from "@/src/context/CategoriesContext";
// import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
// import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
// import LoadingCircle from "@/app/components/appwide/spinner/LoadingCircle";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import manualGradientColors from "@/src/hooks/StaticColors";

const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route?.params?.scrollTo ?? null;
  const { lightDarkTheme } = useLDTheme();
  const { user } = useUser();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { capsuleList, preAdded } = useCapsuleList();

  const { handlePreAddMoment } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { categoryNames, categoryStartIndices } = useTalkingPCategorySorting({
    listData: capsuleList,
  });

  const { navigateToMomentView, navigateBack } = useAppNavigations();
  const TIME_SCORE = 100;

  const { friendListAndUpcoming, isLoading } = useFriendListAndUpcoming();

  // const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const { userCategories } = useCategories();
  // const { friendList } = useFriendList();

  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  const upcomingId = friendListAndUpcoming?.next?.id;

  const { themeAheadOfLoading, getThemeAheadOfLoading, resetTheme } =
    useFriendStyle();

  const { loadingDash } = useFriendDash();

  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const { handleSelectFriend } = useSelectFriend({
    friendList,
    resetTheme,
    getThemeAheadOfLoading,
    selectFriend,
  });

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

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight={120}
      style={{ flex: 1 }}
    >
            <View style={StyleSheet.absoluteFillObject}>
        <GradientBackgroundBreathing
          secondColorSetDark={themeAheadOfLoading.lightColor}
          secondColorSetLight={themeAheadOfLoading.darkColor}
          // firstColorSetDark={manualGradientColors.lightColor}
          // firstColorSetLight={themeAheadOfLoading.darkColor}
          firstColorSetDark={themeAheadOfLoading.lightColor}
          firstColorSetLight={themeAheadOfLoading.darkColor}
          // firstColorSetDark={manualGradientColors.lightColor}
          // firstColorSetLight={manualGradientColors.darkColor}
          timeScore={TIME_SCORE}
          speed={5000}
          style={{ flexDirection: "column", justifyContent: "flex-end" }}
          direction={"vertical"}
        ></GradientBackgroundBreathing>
      </View>
      <TopBarWithAddMoment
        textColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.primaryBackground}
      />
      {/* <View style={{ position: "absolute", top: -150, left: -170 }}>
        <LoadingCircle size={400} loading={true} />
      </View>
      <View style={{ position: "absolute", left: -100 }}>
        <LoadingCircle size={1200} delay={200} loading={true} />
      </View> */}
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
      ></View>
      <View style={{ width: "100%", height: 4 }}></View>
 
      {selectedFriend && !loadingDash && (
        <>
          <View style={{ flex: 1 }}>
            {capsuleList && categoryColorsMap && (
              <MomentsList
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
                friendColor={themeAheadOfLoading.darkColor}
                primaryBackgroundColor={lightDarkTheme.primaryBackground}
                primaryColor={lightDarkTheme.primaryText}
                primaryOverlayColor={lightDarkTheme.overlayBackground}
                friendId={selectedFriend?.id}
                scrollToIndex={scrollTo}
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
