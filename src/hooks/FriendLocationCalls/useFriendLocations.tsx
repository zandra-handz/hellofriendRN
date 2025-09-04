import { View, Text } from "react-native";
import React, { useCallback, useMemo } from "react";

type Props = {
  helloesList: object[];
  locationList: object[];
  friendFaveIds: []; //    friendDash?.friend_faves?.locations;
};

const useFriendLocations = ({
 
  inPersonHelloes,
  locationList,
  friendFaveIds,
}: Props) => {
 

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
      if (locationList && inPersonHelloes && locationList) {
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


 


  return {
    faveLocations,
    nonFaveLocations, 
  };
};

export default useFriendLocations;
