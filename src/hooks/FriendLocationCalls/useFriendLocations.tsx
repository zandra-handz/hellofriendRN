import { View, Text } from "react-native";
import React, { useCallback, useMemo } from "react";

type Props = {
  helloesList: object[];
  locationList: object[];
  friendFaveIds: []; //    friendDash?.friend_faves?.locations;
};

const useFriendLocations = ({
  helloesList,
  inPersonHelloes,
  locationList,
  friendFaveIds,
}: Props) => {


//   const inPersonHelloes = useCallback(() => {
//     if (helloesList) {
//       return helloesList?.filter((hello) => hello.type === "in person");
//     }

//     return [];
//   }, [helloesList]);



  const makeSplitLists = (list, isFaveCondition, helloCheck) => {
    return list.reduce(
      ([fave, notFave], item) => {
        const isFave = isFaveCondition(item);
        const matchingHelloes = helloCheck(item);

        const helloCount = matchingHelloes.length;

        const newItem = {
          ...item,
          isFave,
          isPastHello: helloCount > 0,
          matchingHelloes,
          helloCount,
        };

        return isFave
          ? [[...fave, newItem], notFave]
          : [fave, [...notFave, newItem]];
      },
      [[], []]
    );
  };


    const [faveLocations, nonFaveLocations] = useMemo(() => {
      if (locationList && inPersonHelloes) {
        return makeSplitLists(
          locationList,
          friendFaveIds?.length
            ? (location) => friendFaveIds.includes(location?.id)
            : () => false,
  
          (location) =>
            inPersonHelloes
              .filter((hello) => hello.location === location?.id)
              .map((hello) => ({
                id: hello.id,
                date: hello.date,
              }))
        );
      }
      return [[], []];
    }, [locationList, friendFaveIds, inPersonHelloes]);



    //   const pastHelloLocations = useMemo(() => {
    //     if (locationList && inPersonHelloes && faveLocations && nonFaveLocations) {
    //       return createLocationListWithHelloes(inPersonHelloes, [
    //         ...faveLocations,
    //         ...nonFaveLocations,
    //       ]);
    //     }
    //     console.log(
    //       "something missing, cannnot get past helloes",
    //       locationList?.length,
    //       inPersonHelloes?.length,
    //       faveLocations?.length,
    //       nonFaveLocations?.length
    //     );
    //     return [];
    //   }, [locationList, inPersonHelloes, faveLocations]);
    




  return {
    faveLocations,
    nonFaveLocations,
    // pastHelloLocations,
  };
};

export default useFriendLocations;
