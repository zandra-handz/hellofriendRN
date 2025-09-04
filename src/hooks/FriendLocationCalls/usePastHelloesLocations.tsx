import { View, Text } from "react-native";
import React, { useMemo } from "react"; 
import useLocationHelloFunctions from "../useLocationHelloFunctions";
type Props = {
  friendId: number;
  inPersonHelloes: object[];
  locationList: object[]; // from useLocations context
  faveLocations: []; // from useFriendLocations hook
  nonFaveLocations: []; // from useFriendLocations hook
};

const usePastHelloesLocations = ({
  inPersonHelloes,
  locationList,
  faveLocations,
  nonFaveLocations,
}: Props) => {
  const { createLocationListWithHelloes, bermudaCoords } =
    useLocationHelloFunctions();

  const pastHelloLocations = useMemo(() => {
    if (locationList && inPersonHelloes && faveLocations && nonFaveLocations) {
      return createLocationListWithHelloes(inPersonHelloes, [
        ...faveLocations,
        ...nonFaveLocations,
      ]);
    }
    console.log(
      "something missing, cannnot get past helloes",
      locationList?.length,
      inPersonHelloes?.length,
      faveLocations?.length,
      nonFaveLocations?.length
    );
    return [];
  }, [locationList, inPersonHelloes, faveLocations]);

  return { pastHelloLocations };
};

export default usePastHelloesLocations;
