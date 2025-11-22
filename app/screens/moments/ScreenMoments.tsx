import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
//import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import TopBarWithAddMoment from "./TopBarWithAddMoment";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
// import { useFriendList } from "@/src/context/FriendListContext";

import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
// import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";

import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// import LoadingCircle from "@/app/components/appwide/spinner/LoadingCircle";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useSelectFriend from "@/src/hooks/useSelectFriend";

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

  const { friendListAndUpcoming, isLoading } = useFriendListAndUpcoming({userId: user?.id});

  // const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const { userCategories } = useCategories({userId: user?.id});
  // const { friendList } = useFriendList();

  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  // const upcomingId = friendListAndUpcoming?.next?.id;

  const { loadingDash } = useFriendDash({userId: user?.id, friendId: selectedFriend?.id});

  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList: friendList,
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
    if (
      selectedFriend?.lightColor &&
      selectedFriend?.darkColor &&
      userCategories &&
      userCategories.length > 0
    ) {
      setCategoryColorsMap(
        generateGradientColorsMap(
          userCategories,
          selectedFriend.lightColor,
          selectedFriend.darkColor
        )
      );
    }
  }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight={120}
      style={{ flex: 1 }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <GradientBackgroundBreathing
          secondColorSetDark={selectedFriend.lightColor}
          secondColorSetLight={selectedFriend.darkColor}
          // firstColorSetDark={manualGradientColors.lightColor}
          // firstColorSetLight={selectedFriend.darkColor}
          firstColorSetDark={selectedFriend.lightColor}
          firstColorSetLight={selectedFriend.darkColor}
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
                friendColor={selectedFriend.darkColor}
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

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  innerContainer: {flexDirection: 'column'},
  rowContainer: {flexDirection: 'row'},
  labelWrapper: {},
  label: {},
});


export default ScreenMoments;
