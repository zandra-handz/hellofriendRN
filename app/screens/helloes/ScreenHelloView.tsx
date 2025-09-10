import React, { useEffect, useState, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";
import CarouselSliderInfinite from "@/app/components/appwide/CarouselSliderInfinite";
import useFullHelloes from "@/src/hooks/useFullHelloes";
import HelloViewPage from "@/app/components/helloes/HelloViewPage"; 
import { appFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenHelloView = () => {
  const route = useRoute();
  const startingIndex = route.params?.startingIndex ?? 0;
  const inPersonFilter = route.params?.inPersonFilter ?? false;
  const { selectedFriend } = useSelectedFriend();
  const { helloesList } = useHelloes();
  const { lightDarkTheme } = useLDTheme(); 

  const { themeAheadOfLoading } = useFriendStyle();

  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({
      friendId: selectedFriend?.id,
      indexNeeded: startingIndex,
    });

  const [currentIndex, setCurrentIndex] = useState(startingIndex);

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
      ? helloesListFull.filter((hello) => hello.type === "in person")
      : helloesListFull;
  }, [helloesListFull, inPersonFilter]);

  const totalHelloesCount = useMemo(() => {
    return inPersonFilter &&
      helloesDataFiltered &&
      helloesDataFiltered.length > 0
      ? helloesDataFiltered.length
      : helloesList && helloesList.length > 0
        ? helloesList.length
        : 0;
  }, [inPersonFilter, helloesDataFiltered, helloesList]);

  return (
    <SafeViewAndGradientBackground 
      // friendColorLight={themeAheadOfLoading.lightColor}
      // friendColorDark={themeAheadOfLoading.darkColor}
      // backgroundOverlayColor={lightDarkTheme.primaryBackground}
      // friendId={selectedFriend?.id}
      // style={{ flex: 1 }}
            friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      <CarouselSliderInfinite
        totalItemCount={totalHelloesCount}
        isFiltered={inPersonFilter}
        initialIndex={currentIndex} // should this be startingIndex?
        // data={helloesListData}
        data={helloesDataFiltered}
        children={(props) => (
          <HelloViewPage
            welcomeTextStyle={appFontStyles.welcomeText}
            primaryColor={lightDarkTheme.primaryText}
            lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
            primaryBackground={lightDarkTheme.primaryBackground}
            overlayColor={lightDarkTheme.overlayBackground}
            marginBottom={2}
                    darkerOverlayColor={
          lightDarkTheme.darkerOverlayBackground}
       
            {...props}
          />
        )}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        useButtons={false}
        primaryColor={lightDarkTheme.primaryText}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        welcomeTextStyle={lightDarkTheme.welcomeText}
        themeAheadOfLoading={themeAheadOfLoading} 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloView;
