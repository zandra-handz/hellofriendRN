// import React, {
//   useEffect,
//   createContext,
//   useContext,
//   useState,
//   useRef,
//   useMemo,
//   useCallback,
// } from "react";

// import { useUser } from "./UserContext";

// import { useSelectedFriend } from "./SelectedFriendContext";
// import { useFriendDash } from "./FriendDashContext";
// import { useLocations } from "./LocationsContext";
// import { useHelloes } from "./HelloesContext";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import useLocationHelloFunctions from "../hooks/useLocationHelloFunctions";
 
// const FriendLocationsContext = createContext([]);

// export const useFriendLocationsContext = () =>
//   useContext(FriendLocationsContext);

// export const FriendLocationsProvider = ({ children }) => {
  

//   const { friendDash } = useFriendDash();
//     const favesData = friendDash?.friend_faves?.locations;
 
//   const { locationList } = useLocations();
//   const { helloesList } = useHelloes();
 

//   const inPersonHelloes = helloesList?.filter(
//     (hello) => hello.type === "in person"
//   );


//   const [stickToLocation, setStickToLocation] = useState(null);
 

//   const [friendFavesData, setFriendFavesData] = useState(null);



//   useEffect(() => {
//     if (favesData) {
//       console.log('setting friend data')
//       setFriendFavesData(favesData);
//     }
//   }, [favesData]);
 

//   const { createLocationListWithHelloes, bermudaCoords } =
//     useLocationHelloFunctions();

  
 
//   const makeSplitLists = (list, isFaveCondition, helloCheck) => {
//     return list.reduce(
//       ([fave, notFave], item) => {
//         const isFave = isFaveCondition(item);
//         const matchingHelloes = helloCheck(item);

//         const helloCount = matchingHelloes.length;

//         const newItem = {
//           ...item,
//           isFave,
//           isPastHello: helloCount > 0,
//           matchingHelloes,
//           helloCount,
//         };

//         return isFave
//           ? [[...fave, newItem], notFave]
//           : [fave, [...notFave, newItem]];
//       },
//       [[], []]
//     );
//   };

//   const [faveLocations, nonFaveLocations] = useMemo(() => {
//     if (locationList && inPersonHelloes) {
//       return makeSplitLists(
//         locationList,
//         friendFavesData?.length
//           ? (location) => friendFavesData.includes(location.id)
//           : () => false,

//         (location) =>
//           inPersonHelloes
//             .filter((hello) => hello.location === location.id)
//             .map((hello) => ({
//               id: hello.id,
//               date: hello.date,
//             }))
//       );
//     }
//     return [[], []];
//   }, [locationList, friendFavesData, inPersonHelloes]);

//   //Specific to map
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

//   return (
//     <FriendLocationsContext.Provider
//       value={{
//         inPersonHelloes,
//         faveLocations,
//         nonFaveLocations,
//         pastHelloLocations, 
//         stickToLocation,
//         setStickToLocation,
//       }}
//     >
//       {children}
//     </FriendLocationsContext.Provider>
//   );
// };
