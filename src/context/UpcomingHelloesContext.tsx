// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useUser } from "./UserContext";
// import {
//   fetchUpcomingHelloes,
//   fetchUpcomingHelloesAndFriends,
// } from "../calls/api";
// import { useQuery } from "@tanstack/react-query";

// import useSignOut from "../hooks/UserCalls/useSignOut";

// // remix helloes is in a separate hook
// const UpcomingHelloesContext = createContext({});

// export const useUpcomingHelloes = () => {
//   return useContext(UpcomingHelloesContext);
// };

// export const UpcomingHelloesProvider = ({ children }) => {
//   const { user, isInitializing } = useUser();
//   const { onSignOut } = useSignOut();
 
//   const {
//     data: upcomingHelloes,
//     isLoading,
//     isFetching,
//     isSuccess,
//     isError,
//   } = useQuery({
//     queryKey: ["upcomingHelloes", user?.id],
//     queryFn: () => fetchUpcomingHelloes(),
//     enabled: !!user?.id && !isInitializing, //removed isInitializing to test
//     retry: 3,
//     staleTime: 1000 * 60 * 20, // 20 minutes

//     select: (data) => {
//       if (isError) {
//         return [];
//       }

//       // console.log("data.upcoming!!", data);

//       // if (data.upcoming?.length && data.friends?.length) {
//       //   let upcomingFriend;
//       //   upcomingFriend = data.friends.find(
//       //     (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
//       //   );
//       //   setUpNext(upcomingFriend);
//       // }
//       return data || [];
//     },
//   });

//   useEffect(() => {
//     if (isError) {
//       onSignOut();
//     }
//   }, [isError]);

//   const contextValue = useMemo(
//     () => ({
//       upcomingHelloes,
//       upcomingHelloesIsFetching: isFetching,
//       upcomingHelloesIsSuccess: isSuccess,

//       isLoading,
  
//     }),
//     [upcomingHelloes,  isFetching, isSuccess, isLoading]
//   );

//   return (
//     <UpcomingHelloesContext.Provider value={contextValue}>
//       {children}
//     </UpcomingHelloesContext.Provider>
//   );
// };
