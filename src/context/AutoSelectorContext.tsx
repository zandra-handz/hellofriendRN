import { View, Text } from "react-native";
import React, { createContext, useContext, useMemo, ReactNode } from "react";

// import { useUserSettings } from "./UserSettingsContext";
import useUserSettings from "../hooks/useUserSettings";

// import { findFriendInList } from "../hooks/deselectFriendFunction";
//  import { useFriendListAndUpcoming } from "./FriendListAndUpcomingContext";

 import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
// import { useUser } from "./UserContext";
// import useUser from "../hooks/useUser";
interface AutoSelectorContextType {}

//HARD CODE LIGHT DARK COLOR LOCATION:
//FRIENDTINTPRESSABLE unlikely to be resorted to but does have hard code to get TS to stop yelling at me

const AutoSelectorContext = createContext<AutoSelectorContextType>({});

export const useAutoSelector = (): AutoSelectorContextType =>
  useContext(AutoSelectorContext);

interface AutoSelectorProviderProps {
  children: React.ReactNode;
  userId?: number; // or whatever type your user object is
  settings?: object;
}
// I don't think gradient safe view stuff is being used but leaving it in uncommented for a bit
export const AutoSelectorProvider: React.FC<AutoSelectorProviderProps> = ({
  children,
  userId,
  // settings,
}) => {
//  const { user } = useUser();
  const { friendListAndUpcoming } = useFriendListAndUpcoming({userId: userId});
  const { settings } = useUserSettings();

  // if (!upcomingHelloes?.length || !settings || !friendList?.length) {
  //     return;
  // }

  // const upNextId = upcomingHelloes?.[0]?.friend?.id;

  // const autoSelectId = useMemo(() => {
  //   if (settings?.id && settings?.lock_in_custom_string) {
  //     return Number(settings.lock_in_custom_string);
  //   }

  //   if (settings?.id && settings?.lock_in_next) {
  //     return friendListAndUpcoming?.next?.id != null
  //       ? Number(friendListAndUpcoming.next?.id)
  //       : undefined;
  //   }

  //   return null;
  // }, [settings, friendListAndUpcoming]);

const autoSelectFriend = useMemo(() => {
  // Data not ready yet
  if (!settings?.id || !friendListAndUpcoming?.user) {
    return {
      customFriend: 'pending',
      nextFriend: 'pending',
    };
  }

  // Checked but not found → return sentinel { id: -1 }
  const customFriend = settings.lock_in_custom_string
    ? friendListAndUpcoming.friends.find(
        (friend) => friend.id === Number(settings.lock_in_custom_string)
      ) ?? { id: -1, name: null }
    : { id: -1, name: null };

  const nextFriend = settings.lock_in_next
    ? friendListAndUpcoming.next ?? { id: -1, name: null }
    : { id: -1, name: null };

  return { customFriend, nextFriend };
}, [
  settings?.id,
  settings?.lock_in_next,
  settings?.lock_in_custom_string,
  friendListAndUpcoming?.user,
]);

  const contextValue = useMemo(
    () => ({
      // autoSelectId,
      autoSelectFriend,
    }),
    [
      // autoSelectId,
       autoSelectFriend ]
  );
  return (
    <AutoSelectorContext.Provider value={contextValue}>
      {children}
    </AutoSelectorContext.Provider>
  );
};

export default AutoSelectorContext;
