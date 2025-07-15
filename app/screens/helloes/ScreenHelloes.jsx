import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { useNavigation } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

// import HelloesTabs from "@/app/components/helloes/HelloesTabs";
import Loading from "@/app/components/appwide/display/Loading";
import HelloesList from "@/app/components/helloes/HelloesList";
import HelloesListNew from "@/app/components/helloes/HelloesListNew"; 
import HelloesScreenFooter from "@/app/components/headers/HelloesScreenFooter";

const ScreenHelloes = () => {
  const { themeAheadOfLoading } = useFriendList();
const navigation = useNavigation();
  const { helloesList, flattenHelloes } = useHelloes();
  const [helloesData, setHelloesData] = useState(helloesList || []);
  const [flattenHelloesData, setFlattenHelloesData] = useState(
    flattenHelloes || []
  );

  const [ triggerScroll, setTriggerScroll ] = useState(undefined);
const [ inPersonFilter, setInPersonFilter ] = useState(false);
  

  const toggleHelloesFiltering = (turnOn) => {
    if (turnOn) {
      setHelloesData(helloesList.filter((hello) => hello.type === "in person"));
      setFlattenHelloesData(
        flattenHelloes.filter((hello) => hello.type === "in person")
      );
      console.log('setting in person filter to true');
      setInPersonFilter(true);
    } else {
      setHelloesData(helloesList);
      setFlattenHelloesData(flattenHelloes);
      setInPersonFilter(false);
    }
  };
const navigateToSingleView = useCallback(

  (index) => {
      console.log(`in person filter in nav function:`, inPersonFilter);
    navigation.navigate("HelloView", {
      startingIndex: index,
      inPersonFilter: !!(inPersonFilter)
    });
  },
  [inPersonFilter, navigation]
);

  

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
        flattenHelloes={flattenHelloesData}
        onFilterPress={toggleHelloesFiltering}
        onSearchPress={handleSearchPress}
      />
    );
  }, [helloesData, flattenHelloes, toggleHelloesFiltering]);

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      {/* not sure if will work: */}
      <Loading isLoading={!helloesList} />

      {helloesList && (
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
            {helloesData && <HelloesListNew triggerScroll={triggerScroll} data={helloesData} onPress={navigateToSingleView} />}
          </View>
        </>
      )}
      {RenderHelloesScreenFooter()}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloes;
