import React, { useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useHelloes } from "@/src/context/HelloesContext";
import useHelloesManips from "@/src/hooks/useHelloesManips";
import { useNavigation } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import HelloesTabs from "@/app/components/helloes/HelloesTabs";
import Loading from "@/app/components/appwide/display/Loading";

import HelloesListNew from "@/app/components/helloes/HelloesListNew";
import HelloesScreenFooter from "@/app/components/headers/HelloesScreenFooter";
import useFullHelloes from "@/src/hooks/useFullHelloes";

const ScreenHelloes = () => {
  const navigation = useNavigation();
  const { selectedFriend } = useSelectedFriend();
  const [triggerFetchAll, setTriggerFetchAll] = useState(false);
  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({ friendId: selectedFriend?.id, fetchAll: triggerFetchAll});

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
        helloesList={helloesData}
        flattenHelloes={flattenHelloes}
        onFilterPress={toggleHelloesFiltering}
        addToModalOpenPress={handleOpenSearch}
        onSearchPress={handleSearchPress}
      />
    );
  }, [helloesData, flattenHelloes, toggleHelloesFiltering, handleSearchPress, handleOpenSearch]);

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      {/* not sure if will work: */}
      <Loading isLoading={!helloesListFull} />

      {helloesListFull && (
        <>
          {/* <GlobalAppHeaderIconVersion
            title={"Helloes with"}
            navigateTo="Helloes"
            icon={
              <MaterialCommunityIcons
                // name="hand-wave-outline"
                name="calendar-heart"
                size={30}
                color={themeAheadOfLoading.fontColorSecondary}
              />
            }
          /> */}

          <View style={{ flex: 1 }}>
            {/* {helloesData && <HelloesListNew triggerScroll={triggerScroll} data={helloesData} onPress={navigateToSingleView} />} */}
            {helloesDataFiltered && helloesDataFiltered.length > 0 && (
              <HelloesListNew
                triggerScroll={triggerScroll}
                helloesListFull={helloesDataFiltered}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                onPress={navigateToSingleView}
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
