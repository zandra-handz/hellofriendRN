import React, { useEffect, useState, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext"; 
import CarouselSliderInfinite from "@/app/components/appwide/CarouselSliderInfinite";
import useFullHelloes from "@/src/hooks/useFullHelloes";
import HelloViewPage from "@/app/components/helloes/HelloViewPage";

const ScreenHelloView = () => {
  const route = useRoute();
  const startingIndex = route.params?.startingIndex ?? 0;
  const inPersonFilter = route.params?.inPersonFilter ?? false;
  const { selectedFriend } = useSelectedFriend();
  const { helloesList } = useHelloes();

  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({ friendId: selectedFriend?.id, indexNeeded: startingIndex });

 

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
  return inPersonFilter && helloesDataFiltered && helloesDataFiltered.length > 0
  ? helloesDataFiltered.length
  : helloesList && helloesList.length > 0 ?
  helloesList.length : 0;

 }, [inPersonFilter, helloesDataFiltered, helloesList]);

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <CarouselSliderInfinite
      totalItemCount={totalHelloesCount}
      isFiltered={inPersonFilter}
        initialIndex={currentIndex} // should this be startingIndex?
       // data={helloesListData}
        data={helloesDataFiltered}
        children={HelloViewPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        useButtons={false}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloView;
