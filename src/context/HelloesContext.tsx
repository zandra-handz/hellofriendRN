import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "./UserContext";
import { useSelectedFriend } from "./SelectedFriendContext"; 

 
import { fetchPastHelloes  } from "../calls/api";
import { useQuery  } from "@tanstack/react-query";
 
// interface HelloesType {
//   helloesList: Hello[];
//   helloesIsFetching: boolean;
//   helloesIsLoading: boolean;
//   helloesIsError: boolean;
//   helloesIsSuccess: boolean;
//   flattenHelloes;
//   createHelloMutation;
//   handleCreateHello;

//   handleDeleteHelloRQuery;
//   deleteHelloMutation;
// }

const HelloesContext = createContext({});

export const useHelloes = () => {
  return useContext(HelloesContext);
};

export const HelloesProvider = ({ children }) => {
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();

 

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

 
 // NOT SURE IF THIS GOT MOVED SOMEWHERE ELSE, BC NO COMPONENT IS USING THIS RIGHT NOW
  // const flattenHelloes = useMemo(() => {
  //   if (helloesList) {
  //     return helloesList.flatMap((hello) => {
  //       const pastCapsules = hello.thought_capsules_shared || [];
  //       return pastCapsules.length > 0
  //         ? pastCapsules.map((capsule) => ({
  //             id: hello.id,
  //             date: hello.date,
  //             type: hello.type,
  //             typedLocation: hello.typed_location,
  //             locationName: hello.location_name,
  //             location: hello.location,
  //             additionalNotes: hello.additional_notes || "", // Keep existing additional notes

  //             capsuleId: capsule.id,
  //             capsule: capsule.capsule,
  //             typedCategory: capsule.user_category_name,
  //           }))
  //         : [
  //             {
  //               id: hello.id,
  //               date: hello.date,
  //               type: hello.type,
  //               typedLocation: hello.typed_location,
  //               locationName: hello.location_name,
  //               location: hello.location,
  //               additionalNotes: hello.additional_notes || "", // Keep existing additional notes
  //               capsuleId: null,
  //               capsule: null,
  //               typedCategory: null,
  //             },
  //           ];
  //     });
  //   }
  // }, [helloesList]); 

  const memoizedValue = useMemo(
    () => ({
      helloesList,
      helloesIsFetching,
      helloesIsLoading,
      helloesIsError,
      helloesIsSuccess, 

      // flattenHelloes,
  
    }),
    [
      helloesList,

      helloesIsFetching,
      helloesIsLoading,
      helloesIsError,
      helloesIsSuccess,
 
      // flattenHelloes,
  
    ]
  );

  return (
    <HelloesContext.Provider value={memoizedValue}>
      {children}
    </HelloesContext.Provider>
  );
};
