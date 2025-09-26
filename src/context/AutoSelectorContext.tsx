import { View, Text } from "react-native";
import React, {
  createContext,
  useContext,
 
  useMemo,
  ReactNode,
} from "react";

import { useUserSettings } from "./UserSettingsContext";
import { useUpcomingHelloes } from "./UpcomingHelloesContext";
import { useFriendList } from "./FriendListContext";
 

import { Friend, ThemeAheadOfLoading } from "../types/FriendTypes";

interface AutoSelectorContextType {
 
}

//HARD CODE LIGHT DARK COLOR LOCATION:
//FRIENDTINTPRESSABLE unlikely to be resorted to but does have hard code to get TS to stop yelling at me

const AutoSelectorContext = createContext<AutoSelectorContextType>({
 
  }, 
);

export const useAutoSelector = (): AutoSelectorContextType =>
  useContext(AutoSelectorContext);

interface AutoSelectorProviderProps {
  children: ReactNode;
}

// I don't think gradient safe view stuff is being used but leaving it in uncommented for a bit
export const AutoSelectorProvider: React.FC<AutoSelectorProviderProps> = ({
  children,
}) => {
  const { upcomingHelloes } = useUpcomingHelloes();
  const { settings} = useUserSettings();
  const { friendList } = useFriendList();

  // if (!upcomingHelloes?.length || !settings || !friendList?.length) {
  //     return;
  // }

  // const upNextId = upcomingHelloes?.[0]?.friend?.id;

  const upNextId = useMemo(() => {
    console.error("Calculating upNextId because upcomingHelloes changed");
    return upcomingHelloes?.[0]?.friend?.id ?? null;
  }, [upcomingHelloes]);

  const autoSelectId = useMemo(() => {
    return settings?.lock_in_custom_string
      ? settings?.lock_in_custom_string
      : settings?.lock_in_next
        ? upNextId
        : null;
  }, [settings, upNextId]);

  const contextValue = useMemo(
    () => ({
      autoSelectId,
    }),
    [autoSelectId]
  );
  return (
    <AutoSelectorContext.Provider value={contextValue}>
      {children}
    </AutoSelectorContext.Provider>
  );
};

export default AutoSelectorContext;
