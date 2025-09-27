import { View, Text } from "react-native";
import React, { createContext, useContext, useMemo, ReactNode } from "react";

import { useUserSettings } from "./UserSettingsContext";

import { findFriendInList } from "../hooks/deselectFriendFunction";
import { useFriendListAndUpcoming } from "./FriendListAndUpcomingContext";

import { Friend, ThemeAheadOfLoading } from "../types/FriendTypes";

interface AutoSelectorContextType {}

//HARD CODE LIGHT DARK COLOR LOCATION:
//FRIENDTINTPRESSABLE unlikely to be resorted to but does have hard code to get TS to stop yelling at me

const AutoSelectorContext = createContext<AutoSelectorContextType>({});

export const useAutoSelector = (): AutoSelectorContextType =>
  useContext(AutoSelectorContext);

interface AutoSelectorProviderProps {
  children: ReactNode;
}

// I don't think gradient safe view stuff is being used but leaving it in uncommented for a bit
export const AutoSelectorProvider: React.FC<AutoSelectorProviderProps> = ({
  children,
}) => {
  const { friendListAndUpcoming } = useFriendListAndUpcoming();

  const { settings } = useUserSettings();

  // if (!upcomingHelloes?.length || !settings || !friendList?.length) {
  //     return;
  // }

  // const upNextId = upcomingHelloes?.[0]?.friend?.id;

  const autoSelectId = useMemo(() => {
    if (settings?.id && settings?.lock_in_custom_string) {
      return Number(settings.lock_in_custom_string);
    }

    if (settings?.id && settings?.lock_in_next) {
      return friendListAndUpcoming?.next?.id != null
        ? Number(friendListAndUpcoming.next?.id)
        : undefined;
    }

    return null;
  }, [settings, friendListAndUpcoming]);

const autoSelectFriend = useMemo(() => {
  // if data isn’t ready yet, return undefined
  if (!settings || !friendListAndUpcoming) return { customFriend: undefined, nextFriend: undefined };

  const customFriend = settings.lock_in_custom_string
    ? friendListAndUpcoming.friends.find(
        (friend) => friend.id === Number(settings.lock_in_custom_string)
      ) ?? null // return null if not found
    : null;

  const nextFriend = settings.lock_in_next
    ? friendListAndUpcoming.next ?? null // return null if not set
    : null;

  return { customFriend, nextFriend };
}, [settings, friendListAndUpcoming]);


  const contextValue = useMemo(
    () => ({
      autoSelectId,
      autoSelectFriend,
    }),
    [autoSelectId, autoSelectFriend ]
  );
  return (
    <AutoSelectorContext.Provider value={contextValue}>
      {children}
    </AutoSelectorContext.Provider>
  );
};

export default AutoSelectorContext;
