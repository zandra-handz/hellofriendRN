import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useUser } from "./UserContext";

import { useSelectedFriend } from "./SelectedFriendContext";
import { useFriendDash } from "./FriendDashContext";
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
  const { user } = useUser();

  const { selectedFriend } = useSelectedFriend();

  const { friendDash } = useFriendDash();
    const favesData = friendDash?.friend_faves?.locations;
 
  const { locationList } = useLocations();
  const { helloesList } = useHelloes();
 

  const inPersonHelloes = helloesList?.filter(
    (hello) => hello.type === "in person"
  );


  const [stickToLocation, setStickToLocation] = useState(null);
  const queryClient = useQueryClient();

  const [friendFavesData, setFriendFavesData] = useState(null);



  useEffect(() => {
    if (favesData) {
      setFriendFavesData(favesData);
    }
  }, [favesData]);

  const timeoutRef = useRef(null);

  const { createLocationListWithHelloes, bermudaCoords } =
    useLocationHelloFunctions();

  const addToFavesMutation = useMutation({
    mutationFn: (data) => {
      return addToFriendFavesLocations(data);
    },
    onSuccess: (data, variables) => {
      setFriendFavesData(data.locations);

      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old) {
            return {
              0: {
                friend_faves: {
                  locations: data.locations,
                },
                ...old,
              },
            };
          }

          const updatedDashboardData = {
            ...old,
            0: {
              ...old,
              friend_faves: {
                ...old.friend_faves,
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

  const handleAddToFaves = useCallback(
    async (friendId: number, locationId: number) => {
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
    },
    [addToFavesMutation, user?.id]
  );

  const removeFromFavesMutation = useMutation({
    mutationFn: (data) => {
      return removeFromFriendFavesLocations(data);
    },
    onSuccess: (data) => {
      setFriendFavesData(data.locations);

      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old) {
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
              ...old,
              friend_faves: {
                ...old.friend_faves,
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

  const handleRemoveFromFaves = useCallback(
    async (friendId, locationId) => {
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
    },
    [removeFromFavesMutation, user?.id]
  );

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
        friendFavesData?.length
          ? (location) => friendFavesData.includes(location.id)
          : () => false,

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
    console.log(
      "something missing, cannnot get past helloes",
      locationList?.length,
      inPersonHelloes?.length,
      faveLocations?.length,
      nonFaveLocations?.length
    );
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
