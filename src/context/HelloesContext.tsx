// import React, { createContext, useContext, useMemo } from "react";
// import { useUser } from "./UserContext";
// import { useSelectedFriend } from "./SelectedFriendContext"; 

 
// import { fetchPastHelloes  } from "../calls/api";
// import { useQuery  } from "@tanstack/react-query";
 
// // interface HelloesType {
// //   helloesList: Hello[];
// //   helloesIsFetching: boolean;
// //   helloesIsLoading: boolean;
// //   helloesIsError: boolean;
// //   helloesIsSuccess: boolean;
// //   flattenHelloes;
// //   createHelloMutation;
// //   handleCreateHello;

// //   handleDeleteHelloRQuery;
// //   deleteHelloMutation;
// // }

// const HelloesContext = createContext({});

// export const useHelloes = () => {
//   return useContext(HelloesContext);
// };

// export const HelloesProvider = ({ children }) => {
//   const { user } = useUser();
//   const { selectedFriend } = useSelectedFriend();

 

//   const {
//     data: helloesList,
//     isLoading: helloesIsLoading,
//     isFetching: helloesIsFetching,
//     isSuccess: helloesIsSuccess,
//     isError: helloesIsError,
//   } = useQuery({
//     queryKey: ["pastHelloes", user?.id, selectedFriend?.id],
//     queryFn: () => {
//       return fetchPastHelloes(selectedFriend.id);
//     },
//     enabled: !!(user?.id && selectedFriend?.id), // testing removing !isInitializing
//     staleTime: 1000 * 60 * 20, // 20 minutes, same as selected friend data
//   });
 
//   const memoizedValue = useMemo(
//     () => ({
//       helloesList,
//       helloesIsFetching,
//       helloesIsLoading,
//       helloesIsError,
//       helloesIsSuccess, 

//       // flattenHelloes,
  
//     }),
//     [
//       helloesList,

//       helloesIsFetching,
//       helloesIsLoading,
//       helloesIsError,
//       helloesIsSuccess,
 
//       // flattenHelloes,
  
//     ]
//   );

//   return (
//     <HelloesContext.Provider value={memoizedValue}>
//       {children}
//     </HelloesContext.Provider>
//   );
// };
