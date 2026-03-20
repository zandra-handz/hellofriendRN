import React, { useEffect, useState, useMemo } from "react";
 
import { useRoute } from "@react-navigation/native";
 

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { SafeAreaView } from "react-native-safe-area-context"; 
import useUser from "@/src/hooks/useUser"; 
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
      <SafeAreaView
        style={{
          flex: 1, 
          backgroundColor: lightDarkTheme.primaryBackground,
        }}
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
    {/* </SafeViewAndGradientBackground> */}
    </SafeAreaView>
  );
};

export default ScreenHelloView;
