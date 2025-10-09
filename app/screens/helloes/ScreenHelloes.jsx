import React, { useState, useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import { useHelloes } from "@/src/context/HelloesContext";
import useHelloesManips from "@/src/hooks/useHelloesManips";
import { useNavigation } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import HelloesTabs from "@/app/components/helloes/HelloesTabs";

import CalendarChart from "@/app/components/home/CalendarChart";
import HelloesList from "@/app/components/helloes/HelloesList";
import HelloesScreenFooter from "@/app/components/headers/HelloesScreenFooter";
import useFullHelloes from "@/src/hooks/useFullHelloes"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
const ScreenHelloes = () => {
  const navigation = useNavigation();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const [triggerFetchAll, setTriggerFetchAll] = useState(false);
  const { helloesList } = useHelloes();
  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({ friendId: selectedFriend?.id, fetchAll: triggerFetchAll });
 
  // console.log(helloesListFull);
  const { flattenHelloes } = useHelloesManips({ helloesData: helloesListFull });
  //  console.log(`FLATTEENEEDDEDD`, flattenHelloes);

  const [helloesData, setHelloesData] = useState(helloesListFull || []);

  // useEffect(() => {
  //   if (helloesListFull && helloesListFull.length > 0) {
  //     setHelloesData(helloesListFull);
  //   }

  // }, [helloesListFull]);

  const [flattenHelloesData, setFlattenHelloesData] = useState(
    flattenHelloes || []
  );

  const [triggerScroll, setTriggerScroll] = useState(undefined);
  const [inPersonFilter, setInPersonFilter] = useState(false);

  const { themeAheadOfLoading } = useFriendStyle();
  const toggleHelloesFiltering = (turnOn) => {
    if (turnOn) {
      setHelloesData(
        helloesListFull.filter((hello) => hello.type === "in person")
      );

      setFlattenHelloesData(
        flattenHelloes.filter((hello) => hello.type === "in person")
      );
      console.log("setting in person filter to true");
      setInPersonFilter(true);
    } else {
      setHelloesData(helloesListFull);
      setFlattenHelloesData(flattenHelloes);
      setInPersonFilter(false);
    }
  };

  const helloesDataFiltered = useMemo(() => {
    return inPersonFilter
      ? helloesListFull.filter((hello) => hello.type === "in person")
      : helloesListFull;
  }, [helloesListFull, inPersonFilter]);

  const navigateToSingleView = useCallback(
    (index) => {
      console.log(`in person filter in nav function:`, inPersonFilter);
      navigation.navigate("HelloView", {
        startingIndex: index,
        inPersonFilter: !!inPersonFilter,
      });
    },
    [inPersonFilter, navigation]
  );

  const handleOpenSearch = () => {
    setTriggerFetchAll(true);
  };

  const handleSearchPress = (item) => {
    // console.log(item);
    // console.log(helloesData[0]);

    const itemIndex = helloesData.findIndex((hello) => hello.id === item);
    setTriggerScroll(itemIndex + 1); //don't wanna deal with the 0 not triggering the scroll, taking it off again in child component
    // console.log(`item index`, itemIndex);
  };

  const RenderHelloesScreenFooter = useCallback(() => {
    return (
      <HelloesScreenFooter
        friendId={selectedFriend?.id}
        primaryColor={lightDarkTheme.primaryText}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        helloesList={helloesData}
        flattenHelloes={flattenHelloes}
        onFilterPress={toggleHelloesFiltering}
        addToModalOpenPress={handleOpenSearch}
        onSearchPress={handleSearchPress}
        themeAheadOfLoading={themeAheadOfLoading}
      />
    );
  }, [
    helloesData,
    flattenHelloes,
    themeAheadOfLoading,
    lightDarkTheme,
    toggleHelloesFiltering,
    handleSearchPress,
    handleOpenSearch,
  ]);

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={false}
      useOverlayFade={false} 
      style={{ flex: 1 }}
    >
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          borderRadius: 30,
          height: "auto",
          marginVertical: 0,
        }}
      >
        <Text
          numberOfLines={2}
          style={[
            AppFontStyles.welcomeText,
            { color: lightDarkTheme.primaryText, fontSize: 22 },
          ]}
        >
          Hello history for {selectedFriend?.name}
        </Text>
      </View>
      <CalendarChart
        helloesList={helloesList} 
        friendId={selectedFriend?.id}
        themeAheadOfLoading={themeAheadOfLoading}
        lightDarkTheme={lightDarkTheme}
        useBackgroundOverlay={false}
      />
      {/* <Loading isLoading={!helloesListFull} /> */}

      {helloesListFull && (
        <>
          <View style={{ flex: 1 }}>
            {selectedFriend &&
              helloesDataFiltered &&
              helloesDataFiltered.length > 0 && (
                <HelloesList
                  triggerScroll={triggerScroll}
                  helloesListFull={helloesDataFiltered}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  onPress={navigateToSingleView}
                  primaryColor={lightDarkTheme.primaryText}
                />
              )}
          </View>
        </>
      )}
      {RenderHelloesScreenFooter()}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloes;
