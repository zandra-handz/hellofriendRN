import React, { createContext, useContext, useMemo, useRef } from "react";
import { useUser } from "./UserContext";
import { useSelectedFriend } from "./SelectedFriendContext";
import { useUpcomingHelloes } from "./UpcomingHelloesContext";


import {
  fetchPastHelloes,
  saveHello,
  deleteHelloAPI, 
} from "../calls/api";
import {
  useQuery,
  useMutation,
  useQueryClient, 
} from "@tanstack/react-query";

import { Hello } from "../types/HelloTypes";
interface HelloesType {
        helloesList: Hello[],
      helloesIsFetching: boolean,
      helloesIsLoading: boolean,
      helloesIsError: boolean,
      helloesIsSuccess: boolean, 
      flattenHelloes,
      createHelloMutation,
      handleCreateHello,

      handleDeleteHelloRQuery,
      deleteHelloMutation,

};

const HelloesContext = createContext({});

export const useHelloes = () => {
  return useContext(HelloesContext);
};

export const HelloesProvider = ({ children }) => {
  const { refetchUpcomingHelleos } = useUpcomingHelloes();
  const queryClient = useQueryClient();
  const { selectedFriend } = useSelectedFriend();
  const { user } = useUser();

  const timeoutRef = useRef(null);

  const {
    data: helloesList,
    isLoading: helloesIsLoading,
    isFetching: helloesIsFetching,
    isSuccess: helloesIsSuccess,
    isError: helloesIsError,
  } = useQuery({
    queryKey: ["pastHelloes", user?.id, selectedFriend?.id],
    queryFn: () => {
      return fetchPastHelloes(selectedFriend.id);
    },
    enabled: !!(user?.id && selectedFriend), // testing removing !isInitializing
    staleTime: 1000 * 60 * 20, // 20 minutes, same as selected friend data
  });

  // const {
  //   data: helloesListTemp,
  //   isLoading: helloesListFullIsLoading,
  //   isFetching: helloesListFullIsFetching,
  //   isFetchingNextPage,
  //   isSuccess: helloesListFullIsSuccess,
  //   isError: helloesListFullIsError,
  //   fetchNextPage,
  //   hasNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["pastHelloes", "full", user?.id, selectedFriend?.id],
  //   queryFn: async ({ pageParam = 1 }) => {
  //     return await fetchPastHelloesFull({
  //       friendId: selectedFriend?.id,
  //       page: pageParam,
  //     });
  //   },
  //   getNextPageParam: (lastPage) => {
  //     if (!lastPage?.next) return undefined;
  //     const nextUrl = new URL(lastPage.next);
  //     return Number(nextUrl.searchParams.get("page"));
  //   },
  //   initialPageParam: 1,
  //   enabled: !!(selectedFriend?.id && user?.id),
  //   staleTime: 1000 * 60 * 60 * 10,
  // });

  const createHelloMutation = useMutation({
    mutationFn: (data) => saveHello(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    onSuccess: (data, variables) => {
      const friendId = variables.friend;
      const normalized = {
        ...data,
        dateLong: data.date,
        date: data.past_date_in_words || formatDate(data.date),
      };

      queryClient.setQueryData(["pastHelloes", user?.id, friendId], (old) => {
        const updatedHelloes = old ? [normalized, ...old] : [normalized];
        return updatedHelloes;
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    // onSuccess: (data) => {
    //   const normalized = {
    //     ...data,
    //     dateLong: data.date, // or format if needed
    //     date: data.past_date_in_words || formatDate(data.date), // optional
    //   };

    //   queryClient.setQueryData(
    //     ["pastHelloes", user?.id, selectedFriend?.id],
    //     (old) => {
    //       const updatedHelloes = old ? [normalized, ...old] : [normalized];
    //       return updatedHelloes;
    //     }
    //   );

    //   // const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
    //   //console.log("Actual HelloesList after mutation:", actualHelloesList);

    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = setTimeout(() => {
    //     createHelloMutation.reset();
    //   }, 2000);
    // },
  });

  const handleCreateHello = (helloData) => {
    const hello = {
      user: user.id,
      friend: helloData.friend,
      type: helloData.type,
      typed_location: helloData.manualLocation,
      additional_notes: helloData.notes,
      location: helloData.locationId,
      date: helloData.date,
      thought_capsules_shared: helloData.momentsShared,
      delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
    };

    try {
      createHelloMutation.mutate(hello);
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  // useEffect(() => {
  //   console.log("helloeslistupdated: ", helloesList);
  // }, [helloesList]);

  const handleDeleteHelloRQuery = async (data) => {
    try {
      await deleteHelloMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHelloMutation = useMutation({
    mutationFn: (data) => deleteHelloAPI(data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["pastHelloes", user?.id, selectedFriend?.id],
        (old) => {
          return old ? old.filter((hello) => hello.id !== data.id) : [];
        }
      );

      refetchUpcomingHelleos();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteHelloMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        deleteHelloMutation.reset();
      }, 2000);
    },
  });

  // const flattenHelloes = useMemo(() => {
  //   if (helloesList) {
  //     return helloesList.flatMap((hello) => {
  //       const pastCapsules = hello.pastCapsules || [];
  //       return pastCapsules.length > 0
  //         ? pastCapsules.map((capsule) => ({
  //             id: hello.id,
  //             date: hello.date,
  //             type: hello.type,
  //             typedLocation: hello.typedLocation,
  //             locationName: hello.locationName,
  //             location: hello.location,
  //             additionalNotes: hello.additionalNotes || "", // Keep existing additional notes
  //             capsuleId: capsule.id,
  //             capsule: capsule.capsule,
  //             typedCategory: capsule.typed_category,
  //           }))
  //         : [
  //             {
  //               id: hello.id,
  //               date: hello.date,
  //               type: hello.type,
  //               typedLocation: hello.typedLocation,
  //               locationName: hello.locationName,
  //               location: hello.location,
  //               additionalNotes: hello.additionalNotes || "", // Keep existing additional notes
  //               capsuleId: null,
  //               capsule: null,
  //               typedCategory: null,
  //             },
  //           ];
  //     });
  //   }
  // }, [helloesList]);


   const flattenHelloes = useMemo(() => {
    if (helloesList) {
      return helloesList.flatMap((hello) => {
        const pastCapsules = hello.thought_capsules_shared || [];
        return pastCapsules.length > 0
          ? pastCapsules.map((capsule) => ({
              id: hello.id,
              date: hello.date,
              type: hello.type,
              typedLocation: hello.typed_location,
              locationName: hello.location_name,
              location: hello.location,
              additionalNotes: hello.additional_notes || "", // Keep existing additional notes
              
              capsuleId: capsule.id,
              capsule: capsule.capsule,
              typedCategory: capsule.user_category_name,
            }))
          : [
              {
                id: hello.id,
                date: hello.date,
                type: hello.type,
                typedLocation: hello.typed_location,
                locationName: hello.location_name,
                location: hello.location,
                additionalNotes: hello.additional_notes || "", // Keep existing additional notes
                capsuleId: null,
                capsule: null,
                typedCategory: null,
              },
            ];
      });
    }
  }, [helloesList]);

  // const flatResults =
  //   helloesListTemp?.pages.flatMap((page) => page.results) ?? [];

  const memoizedValue = useMemo(
    () => ({
      helloesList,
      helloesIsFetching,
      helloesIsLoading,
      helloesIsError,
      helloesIsSuccess,

      // helloesListFull: flatResults,
      // isFetchingNextPage,
      // fetchNextPage,
      // hasNextPage,

      flattenHelloes,
      createHelloMutation,
      handleCreateHello,

      handleDeleteHelloRQuery,
      deleteHelloMutation,
    }),
    [
      helloesList,

      helloesIsFetching,
      helloesIsLoading,
      helloesIsError,
      helloesIsSuccess,

      // flatResults,
      // isFetchingNextPage,
      // fetchNextPage,
      // hasNextPage,
      flattenHelloes,
      createHelloMutation,
      handleCreateHello,
      handleDeleteHelloRQuery,
      deleteHelloMutation,
    ]
  );

  return (
    <HelloesContext.Provider value={memoizedValue}>
      {children}
    </HelloesContext.Provider>
  );
};
