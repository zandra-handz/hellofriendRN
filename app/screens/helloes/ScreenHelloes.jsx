import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
// import { useHelloes } from "@/src/context/HelloesContext";
import useHelloes from "@/src/hooks/useHelloes";
import useHelloesManips from "@/src/hooks/HelloesFunctions/useHelloesManips";
import { useNavigation } from "@react-navigation/native";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import TextHeader from "@/app/components/appwide/format/TextHeader";
// import HelloesTabs from "@/app/components/helloes/HelloesTabs";
// import { useUser } from "@/src/context/UserContext";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import useUser from "@/src/hooks/useUser";
import CalendarChart from "@/app/components/home/CalendarChart";
import HelloesList from "@/app/components/helloes/HelloesList";
import HelloesScreenFooter from "@/app/components/headers/HelloesScreenFooter";
import useFullHelloes from "@/src/hooks/HelloesCalls/useFullHelloes";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/app/styles/AppFonts";
const ScreenHelloes = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const [triggerFetchAll, setTriggerFetchAll] = useState(false);
  const { helloesList } = useHelloes({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });
  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({ friendId: selectedFriend?.id, fetchAll: triggerFetchAll });

  const { flattenHelloes } = useHelloesManips({ helloesData: helloesListFull });

  const [helloesData, setHelloesData] = useState(helloesListFull || []);
  const headerLabel = selectedFriend.name
    ? `Helloes for ${selectedFriend.name}`
    : "Helloes";

  const [flattenHelloesData, setFlattenHelloesData] = useState(
    flattenHelloes || [],
  );

  const [triggerScroll, setTriggerScroll] = useState(undefined);
  const [inPersonFilter, setInPersonFilter] = useState(false);




  const textColor = lightDarkTheme.primaryText;
  const backgroundColor = lightDarkTheme.primaryBackground;

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const toggleHelloesFiltering = (turnOn) => {
    if (turnOn) {
      setHelloesData(
        helloesListFull.filter((hello) => hello.type === "in person"),
      );

      // setFlattenHelloesData(
      //   flattenHelloes.filter((hello) => hello.type === "in person"),
      // );
      console.log("setting in person filter to true");
      setInPersonFilter(true);
    } else {
      setHelloesData(helloesListFull);
      // setFlattenHelloesData(flattenHelloes);
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
    [inPersonFilter, navigation],
  );

  const handleOpenSearch = () => {
    setTriggerFetchAll(true);
  };

  const handleSearchPress = (item) => { 
    const itemIndex = helloesData.findIndex((hello) => hello.id === item);
    setTriggerScroll(itemIndex + 1); //don't wanna deal with the 0 not triggering the scroll, taking it off again in child component
    // console.log(`item index`, itemIndex);
  };

  // const RenderHelloesScreenFooter = useCallback(() => {
  //   return (
  //     <HelloesScreenFooter
  //       friendId={selectedFriend?.id}
  //       primaryColor={lightDarkTheme.primaryText}
  //       overlayColor={lightDarkTheme.overlayBackground}
  //       dividerStyle={lightDarkTheme.divider}
  //       helloesList={helloesData}
  //       flattenHelloes={flattenHelloes}
  //       onFilterPress={toggleHelloesFiltering}
  //       addToModalOpenPress={handleOpenSearch}
  //       onSearchPress={handleSearchPress}
  //       themeColors={{
  //         lightColor: selectedFriend.lightColor,
  //         darkColor: selectedFriend.darkColor,
  //         fontColorSecondary: selectedFriend.fontColorSecondary,
  //       }}
  //     />
  //   );
  // }, [
  //   helloesData,
  //   flattenHelloes,
  //   selectedFriend,
  //   lightDarkTheme,
  //   toggleHelloesFiltering,
  //   handleSearchPress,
  //   handleOpenSearch,
  // ]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal: 0,
      }}
    >
      <TextHeader
        label={headerLabel}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={false}
        nextEnabled={false}
      />

      {/* {helloesList && ( */}
        <View style={styles.outerPieWrapper}>
          <CalendarChart
            helloesList={helloesList}
            friendId={selectedFriend?.id}
            themeColors={{
              lightColor: selectedFriend.lightColor,
              darkColor: selectedFriend.darkColor,
              fontColorSecondary: selectedFriend.fontColorSecondary,
            }}
            lightDarkTheme={lightDarkTheme}
            useBackgroundOverlay={false}
          />
        </View>
      {/* )} */}

      {helloesListFull && (
        <>
          <Animated.View
            entering={SlideInDown.duration(200)} // have to match the timing in pie scaling
            exiting={SlideOutDown.duration(200)} // have to match the timing in pie scaling
            style={{
              paddingTop: 40,
              height: "55%",
              flexGrow: 1,
              width: "100%",
            }}
          >
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
          </Animated.View>
        </>
      )}
      {/* {RenderHelloesScreenFooter()} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 30,
    height: "auto",
    marginVertical: 0,
  },
  outerPieWrapper: {
    width: "100%",
    flex: 1,
    paddingBottom: 30,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default ScreenHelloes;
