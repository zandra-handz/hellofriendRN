import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import TopBarWithAddMoment from "./TopBarWithAddMoment";
import Loading from "@/app/components/appwide/display/Loading";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import { useCategories } from "@/src/context/CategoriesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";

const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route?.params?.scrollTo ?? null;
  const { capsuleList } = useCapsuleList();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { generateGradientColorsMap } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const { userCategories } = useCategories();
  const { friendList } =
    useFriendList();

  const {  themeAheadOfLoading, getThemeAheadOfLoading } =
    useFriendStyle();
  const { selectedFriend, setFriend, loadingNewFriend } = useSelectedFriend();

  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
  const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);

  const handleSelectUpNext = () => {
    const { id, name } = upcomingHelloes[0].friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    setFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === id);
    getThemeAheadOfLoading(friend);
  };

  useEffect(() => {
    if (loadingNewFriend || isLoading) {
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
  }, [
    selectedFriend,
    loadingNewFriend,
    isLoading,
    friendList,
    upcomingHelloes,
  ]);

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
      ></View>
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
