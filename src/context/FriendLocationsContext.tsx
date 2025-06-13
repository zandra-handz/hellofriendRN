import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import { useUser } from "./UserContext";
import { useSelectedFriend } from "./SelectedFriendContext";
import { useLocations } from "./LocationsContext";
import { useHelloes } from "./HelloesContext";

import useLocationHelloFunctions from "../hooks/useLocationHelloFunctions";

const FriendLocationsContext = createContext([]);

export const useFriendLocationsContext = () =>
  useContext(FriendLocationsContext);

export const FriendLocationsProvider = ({ children }) => {
  const { user, isAuthenticated } = useUser();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { locationList } = useLocations();
  const { helloesList } = useHelloes();

  const { createLocationListWithHelloes, bermudaCoords } =
    useLocationHelloFunctions();

 

  const makeSplitLists = (list, isFaveCondition, helloCheck) => {
    return list.reduce(
      ([fave, notFave], item) => {
        const isFave = isFaveCondition(item);
        const matchingHelloes = helloCheck(item); // returns an array of matching hellos

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

  const inPersonHelloes = useMemo(() => {
    if (helloesList) {
      return helloesList?.filter((hello) => hello.type === "in person");
    }
  }, [helloesList]);

  // added together with spread operator, these are the complete list of locations
  const [faveLocations, nonFaveLocations] = useMemo(() => {
    if (
      locationList &&
      inPersonHelloes &&
      friendDashboardData?.[0]?.friend_faves?.locations
    ) {
      return makeSplitLists(
        locationList,
        (location) =>
          friendDashboardData[0].friend_faves.locations.includes(location.id),

        // if want full hello objects instead:

        //   (location) =>
        //     inPersonHelloes.filter((hello) => hello.location === location.id)
        // );

        // just hello ids, to match with helloesList in components:
        //   (location) =>
        //     inPersonHelloes
        //       .filter((hello) => hello.location === location.id)
        //       .map((hello) => hello.id)
        // );

        // finally: hello ids and dates:
        (location) =>
          inPersonHelloes
            .filter((hello) => hello.location === location.id)
            .map((hello) => ({
              id: hello.id,
              date: hello.date,
            }))
      );
    }
    return [[], []];
  }, [locationList, friendDashboardData, inPersonHelloes]);

  //Specific to map
  const pastHelloLocations = useMemo(() => {
    if (locationList && inPersonHelloes && faveLocations && nonFaveLocations) {
      return createLocationListWithHelloes(inPersonHelloes, [
        ...faveLocations,
        ...nonFaveLocations,
      ]);
    }
    return [];
  }, [locationList, inPersonHelloes, faveLocations]);

  return (
    <FriendLocationsContext.Provider
      value={{
        inPersonHelloes,
        faveLocations,
        nonFaveLocations,
        pastHelloLocations,
      }}
    >
      {children}
    </FriendLocationsContext.Provider>
  );
};
