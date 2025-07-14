import React, {
  createContext,
  useState,
  useContext, 
} from "react"; 
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  updateFriendFavesColorThemeSetting,
  resetFriendFavesColorThemeToDefault,
} from "../calls/api";

const SelectedFriendContext = createContext({});

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }
  return context;
};

console.warn('selected friend context rerendered');

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { user, isAuthenticated } = useUser();
 
  // const [friendFavesData, setFriendFavesData] = useState(null);

//  console.log("SelectedFriendProvider RENDERED", {
//   userId: user?.id,
//   friendId: selectedFriend?.id,
//   enabled: !!(isAuthenticated && selectedFriend && selectedFriend?.id),
// }); 

 
  const queryClient = useQueryClient();


  const previousFriendIdRef = React.useRef(null);

const {
  data: friendDashboardData,
  isLoading,
  isPending,
  isError,
  isSuccess,
} = useQuery({
  queryKey: ["friendDashboardData", user?.id, selectedFriend?.id],
  queryFn: () => {
    // Prevent refetching if friend is unchanged
    if (selectedFriend?.id === previousFriendIdRef.current) {
      return Promise.resolve(friendDashboardData); // don't re-call API
    }

    previousFriendIdRef.current = selectedFriend?.id;
    return fetchFriendDashboard(selectedFriend.id);
  },
  enabled: !!(isAuthenticated && selectedFriend),
  staleTime: 1000 * 60 * 20,
});

  // const {
  //   data: friendDashboardData,
  //   isLoading,
  //   isPending,
  //   isError,
  //   isSuccess,
  // } = useQuery({
  //   queryKey: ["friendDashboardData", user?.id, selectedFriend?.id],
  //   queryFn: () => fetchFriendDashboard(selectedFriend.id),
  //   enabled: !!(isAuthenticated && selectedFriend),
  //   staleTime: 1000 * 60 * 20, // 20 minutes
 
  // }); 
  // const favesData = useMemo(() => {
  //   if (!friendDashboardData) return null;
  //   return friendDashboardData[0]?.friend_faves?.locations || null;
  // }, [friendDashboardData]);

  // useEffect(() => {
  //   if (favesData) {
  //     setFriendFavesData(favesData);
  //   }
  // }, [favesData]);
 

  const updateFavesThemeMutation = useMutation({
    mutationFn: (data) => updateFriendFavesColorThemeSetting(data),

    // onError: (error) => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = setTimeout(() => {
    //     createHelloMutation.reset();
    //   }, 2000);
    // },
    onSuccess: (data) => {
      // console.log(data);
      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (oldData) => {
          if (!oldData || !oldData[0]) return oldData;

          return {
            ...oldData,
            0: {
              ...oldData[0],
              friend_faves: {
                ...oldData[0].friend_faves,
                use_friend_color_theme: data.use_friend_color_theme,
              },
            },
          };
        }
      ); 
    },
  });

  const handleUpdateFavesTheme = ({savedDarkColor, savedLightColor, manualThemeOn}) => {
    console.warn('handle update faves theme');
 
    const theme = {
      userId: user?.id,
      friendId: selectedFriend?.id,

      darkColor: savedDarkColor,
      lightColor: savedLightColor,
      manualTheme: manualThemeOn,
      //  use_friend_color_theme: true,
    };

    try {
      updateFavesThemeMutation.mutate(theme);
      // await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  const loadingNewFriend = isLoading;
  const friendLoaded = isSuccess;
  const errorLoadingFriend = isError;

  const deselectFriend = () => {
    console.warn('DESELECT FRIEND FUNCTUON CALLED');

    setSelectedFriend(null);
    // resetTheme();  REMOVED IN ORDER TO REMOVE FRIEND LIST FROM THIS PROVIDER SO THAT THAT DOESN'T WATERFALL. MUST RESET THEME IN COMPONENTS
    // (example: HelloFriendFooter)
  };
 

  return (
    <SelectedFriendContext.Provider
      value={{
        selectedFriend,
        setFriend: setSelectedFriend,
         deselectFriend,
        friendLoaded,
        errorLoadingFriend,
     
        isPending,
        isLoading,
        isSuccess,
        friendDashboardData,
        // friendFavesData,
        // setFriendFavesData,
        loadingNewFriend,
        handleUpdateFavesTheme,
      }}
    >
      {children}
    </SelectedFriendContext.Provider>
  );
};

//export default SelectedFriendContext;
