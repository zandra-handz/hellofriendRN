// import React, { createContext, useContext, useMemo } from "react";

// import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";

// interface AutoSelectorContextType {}

// const AutoSelectorContext = createContext<AutoSelectorContextType>({});

// export const useAutoSelector = (): AutoSelectorContextType =>
//   useContext(AutoSelectorContext);

// interface AutoSelectorProviderProps {
//   children: React.ReactNode;
//   userId?: number; // or whatever type your user object is
//   settings?: object;
// }
// // I don't think gradient safe view stuff is being used but leaving it in uncommented for a bit
// export const AutoSelectorProvider: React.FC<AutoSelectorProviderProps> = ({
//   children,
//   userId,
//   settings,
// }) => {
//   const { friendListAndUpcoming } = useFriendListAndUpcoming({
//     userId: userId,
//   });

//   // console.log("autoselect context");

//   const autoSelectFriend = useMemo(() => {
//     if (!settings?.id || !friendListAndUpcoming?.user) {
//       return {
//         customFriend: "pending",
//         nextFriend: "pending",
//       };
//     }

//     // Checked but not found → return sentinel { id: -1 }
//     const customFriend = settings.lock_in_custom_string
//       ? (friendListAndUpcoming.friends.find(
//           (friend) => friend.id === Number(settings.lock_in_custom_string),
//         ) ?? { id: -1, name: null })
//       : { id: -1, name: null };

//     const nextFriend = settings.lock_in_next
//       ? (friendListAndUpcoming.next ?? { id: -1, name: null })
//       : { id: -1, name: null };

//     return { customFriend, nextFriend };
//   }, [
//     settings?.id,
//     settings?.lock_in_next,
//     settings?.lock_in_custom_string,
//     friendListAndUpcoming?.user,
//   ]);

//   const contextValue = useMemo(
//     () => ({
//       autoSelectFriend,
//     }),
//     [autoSelectFriend],
//   );
//   return (
//     <AutoSelectorContext.Provider value={contextValue}>
//       {children}
//     </AutoSelectorContext.Provider>
//   );
// };

// export default AutoSelectorContext;
