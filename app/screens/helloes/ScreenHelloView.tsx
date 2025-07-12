import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useFocusEffect } from "@react-navigation/native";
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendList } from "@/src/context/FriendListContext";

import { useHelloes } from "@/src/context/HelloesContext";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";

import HelloViewPage from "@/app/components/helloes/HelloViewPage";

const ScreenHelloView = () => {
  const route = useRoute();
 // const hello = route.params?.hello ?? null;
  const startingIndex = route.params?.startingIndex ?? 0;
  const inPersonFilter = route.params?.inPersonFilter ?? false;
console.log(`in person filter`, inPersonFilter);
console.log(startingIndex);
  const { themeAheadOfLoading } = useFriendList();
  const { helloesList } = useHelloes();

  const [helloesListData, setHelloesListData] = useState(helloesList || []);

  const [currentIndex, setCurrentIndex] = useState(startingIndex);

  // useEffect(() => {

  // });

  // const setIndex = (hello) => {
  //   if (hello) {
  //     const index = helloesList.findIndex((item) => item.id === hello.id);
  //     setCurrentIndex(index);
  //   }
  // };

  useEffect(() => {
    console.log(helloesListData.length);
  }, [ helloesListData]);

  useEffect(() => {
    console.log("helloes list filter", inPersonFilter);
    if (inPersonFilter && helloesList.length > 0) {
      setHelloesListData(
        helloesList.filter((hello) => hello.type === "in person")
      );
    } else {
      setHelloesListData(helloesList);
    }
  }, [inPersonFilter]);

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      {/* <GlobalAppHeaderIconVersion
        title={"Helloes with"}
        navigateTo="Helloes"
        icon={
          <MaterialCommunityIcons
            name="hand-wave-outline"
            size={30}
            color={themeAheadOfLoading.fontColorSecondary}
          />
        }
      /> */}

      <CarouselSlider
        initialIndex={currentIndex}
        data={helloesListData}
        children={HelloViewPage}
        useButtons={false}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloView;
