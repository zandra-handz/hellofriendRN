import React, { useEffect, useState, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useHelloes } from "@/src/context/HelloesContext";
import useUser from "@/src/hooks/useUser";
// import { useUser } from "@/src/context/UserContext";
import useHelloes from "@/src/hooks/useHelloes";
import CarouselSliderInfinite from "@/app/components/appwide/CarouselSliderInfinite";
import useFullHelloes from "@/src/hooks/HelloesCalls/useFullHelloes";
import HelloViewPage from "@/app/components/helloes/HelloViewPage";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenHelloView = () => {
  const route = useRoute();
  const startingIndex = route.params?.startingIndex ?? 0;
  const inPersonFilter = route.params?.inPersonFilter ?? false;
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { helloesList } = useHelloes({userId: user?.id, friendId: selectedFriend?.id});
  const { lightDarkTheme } = useLDTheme();

  const {
    trueHelloes,
    helloesListFull,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFullHelloes({
    friendId: selectedFriend?.id,
    indexNeeded: startingIndex,
  });

  const [currentIndex, setCurrentIndex] = useState(startingIndex);

  const trueHelloesInList = helloesList.filter(
    (hello) => hello.manual_reset === undefined
  );

  // useEffect(() => {
  //   console.log(helloesListData.length);
  // }, [helloesListData]);

  // useEffect(() => {
  //   // console.log("helloes list filter", inPersonFilter);
  //   if (inPersonFilter && helloesListFull.length > 0) {
  //     setHelloesListData(
  //       helloesListFull.filter((hello) => hello.type === "in person")
  //     );
  //   } else {
  //     setHelloesListData(helloesListFull);
  //   }
  // }, [inPersonFilter]);
  // const [ totalHelloesCount, setTotalHelloesCount ] = helloesList?.length || 0;

  const helloesDataFiltered = useMemo(() => {
    return inPersonFilter
      ? trueHelloes.filter((hello) => hello.type === "in person")
      : trueHelloes;
  }, [trueHelloes, inPersonFilter]);

  const totalHelloesCount = useMemo(() => {
    return inPersonFilter &&
      helloesDataFiltered &&
      helloesDataFiltered.length > 0
      ? helloesDataFiltered.length
      : trueHelloesInList && trueHelloesInList.length > 0
        ? trueHelloesInList.length
        : 0;
  }, [inPersonFilter, helloesDataFiltered, trueHelloesInList]);

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      style={{ flex: 1 }}
    >
      <CarouselSliderInfinite
        totalItemCount={totalHelloesCount}
        isFiltered={inPersonFilter}
        initialIndex={currentIndex} // should this be startingIndex?
        data={helloesDataFiltered}
        children={(props) => (
          <HelloViewPage
            welcomeTextStyle={AppFontStyles.welcomeText}
            primaryColor={lightDarkTheme.primaryText}
            lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
            primaryBackground={lightDarkTheme.primaryBackground}
            overlayColor={lightDarkTheme.overlayBackground}
            marginBottom={2}
            darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
            {...props}
          />
        )}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        useButtons={false}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        welcomeTextStyle={lightDarkTheme.welcomeText}
 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloView;
