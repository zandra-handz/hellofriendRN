import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useUser } from "./UserContext";

import { useSelectedFriend } from "./SelectedFriendContext";
import { useLocations } from "./LocationsContext";
import { useHelloes } from "./HelloesContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useLocationHelloFunctions from "../hooks/useLocationHelloFunctions";

import {
  addToFriendFavesLocations,
  removeFromFriendFavesLocations,
} from "../calls/api";

const FriendLocationsContext = createContext([]);

export const useFriendLocationsContext = () =>
  useContext(FriendLocationsContext);

export const FriendLocationsProvider = ({ children }) => {
  const { user, isAuthenticated } = useUser();

  const { selectedFriend, friendFavesData, setFriendFavesData } =
    useSelectedFriend();
  const { locationList } = useLocations();
  const { helloesList } = useHelloes();
  const [stickToLocation, setStickToLocation] = useState(null);
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const { createLocationListWithHelloes, bermudaCoords } =
    useLocationHelloFunctions();

  const addToFavesMutation = useMutation({
    mutationFn: (data) => {
      return addToFriendFavesLocations(data);
    },
    onSuccess: (data, variables) => {
      setFriendFavesData(data.locations);
      const friendData = queryClient.getQueryData([
        "friendDashboardData",
        user?.id,
        selectedFriend?.id,
      ]);
      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old[0]) {
            return {
              0: {
                friend_faves: {
                  locations: data.locations,
                },
                ...old?.[0],
              },
            };
          }

          const updatedDashboardData = {
            ...old,
            0: {
              ...old[0],
              friend_faves: {
                ...old[0].friend_faves,
                locations: data.locations,
              },
            },
          };

          //console.log(updatedDashboardData);
          return updatedDashboardData;
        }
      );
    },
    onError: (error) => {
      console.error("Error adding location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        addToFavesMutation.reset();
      }, 2000);
    },
  });

const handleAddToFaves = useCallback(async (friendId, locationId) => {

    if (!user?.id) {
    console.warn("No user logged in - cannot add to favorites");
    return;
  }

  const favoriteLocationData = { friendId, userId: user?.id, locationId };
  try {
    await addToFavesMutation.mutateAsync(favoriteLocationData);
    setStickToLocation(locationId);
  } catch (error) {
    console.error("Error adding location to friend faves: ", error);
  }
}, [addToFavesMutation, user?.id]);



  const removeFromFavesMutation = useMutation({
    mutationFn: (data) => {
      // console.log('REMOVING FRO FAVES', data.locationId);
      // setStickToLocation(data.locationId);
      return removeFromFriendFavesLocations(data);
    },
    onSuccess: (data) => {
      setFriendFavesData(data.locations);
      const friendData = queryClient.getQueryData([
        "friendDashboardData",
        user?.id,
        selectedFriend?.id,
      ]);

      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old[0]) {
            return {
              0: {
                friend_faves: {
                  locations: data.locations,
                },
                ...old?.[0],
              },
            };
          }

          const updatedDashboardData = {
            ...old,
            0: {
              ...old[0],
              friend_faves: {
                ...old[0].friend_faves,
                locations: data.locations,
              },
            },
          };

          //console.log(updatedDashboardData);
          return updatedDashboardData;
        }
      );
    },
    onError: (error) => {
      console.error("Error removing location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        removeFromFavesMutation.reset();
      }, 2000);
    },
  });

const handleRemoveFromFaves = useCallback(async (friendId, locationId) => {
    if (!user?.id) {
    console.warn("No user logged in - cannot add to favorites");
    return;
  }
  const favoriteLocationData = { friendId, userId: user?.id, locationId };
  try {
    await removeFromFavesMutation.mutateAsync(favoriteLocationData);
    setStickToLocation(locationId);
  } catch (error) {
    console.error("Error removing location from friend faves: ", error);
  }
}, [removeFromFavesMutation, user?.id]);

  console.log("FRIEND LOCATIONS RERENDERED");
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
      console.log(`friend location list`, friendFavesData);

    if (
      locationList &&
      inPersonHelloes 
     // friendFavesData?.length > 0
      //friendDashboardData?.[0]?.friend_faves?.locations
    ) {
      return makeSplitLists(
        locationList,
        // (location) => friendFavesData.includes(location.id),
          friendFavesData?.length
    ? (location) => friendFavesData.includes(location.id)
    : () => false,
        //  friendDashboardData[0].friend_faves.locations.includes(location.id),

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
  }, [locationList, friendFavesData, inPersonHelloes]);

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
        handleRemoveFromFaves,
        handleAddToFaves,
        stickToLocation,
        setStickToLocation,
      }}
    >
      {children}
    </FriendLocationsContext.Provider>
  );
};
