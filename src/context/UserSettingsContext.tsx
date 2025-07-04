import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, AccessibilityInfo } from "react-native";
import { useUser } from "./UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  getUserCategories,
  updateUserAccessibilitySettings,
  createUserCategory,
  updateUserCategory,
  deleteUserCategory,
  updateSubscription,
  getUserSettings,
} from "../calls/api";

import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useGlobalStyle } from "./GlobalStyleContext";

import isEqual from "lodash.isequal";
import { setUser } from "@sentry/react-native";

interface UserSettings {
  id: number | null;
  user: number | null;
  expo_push_token: string | null;
  high_contrast_mode: boolean;
  interests: string | null;
  language_preference: string | null;
  large_text: boolean;
  manual_dark_mode: boolean;
  receive_notifications: boolean;
  screen_reader: boolean;
}

interface UserSettingsContextType {}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};

interface UserSettingsProviderProps {
  children: ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({
  children,
}) => {
  const { user, isInitializing, isAuthenticated } = useUser();
  console.log("USER SETTINGS CONTEXT");

  const [notificationSettings, setNotificationSettings] = useState<
    Record<string, any>
  >({});
  const queryClient = useQueryClient();

  const {
    data: userSettings,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userSettings", user?.id],
    queryFn: () => getUserSettings(user?.id),
    enabled: !!(user && user.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
    // select: (data) => {
    //   console.log("Query settled.");
    //   if (data) {
    //     setSettings(data || {});
    //     setUserCategories(data.user_categories || {});

    //     setNotificationSettings({
    //       receive_notifications: user?.receive_notifications || false,
    //     });
    //   }
    //   if (error) {
    //     console.error("Settings error:", error);
    //   }
    // },
  });

useEffect(() => {
  if (isSuccess && userSettings) {
    console.log('resetting user settings');
    setSettings(userSettings || {});
    setUserCategories(userSettings.user_categories || []);
    setNotificationSettings({
      receive_notifications: userSettings.receive_notifications ?? false,
    });
  }
}, [isSuccess, userSettings]);

  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [userCategories, setUserCategories] = useState<Record<
    string,
    any
  > | null>(null);

 
 

  // reset
  useEffect(() => {
    if (isInitializing && !isAuthenticated) {
      console.log("user not authenticated, resetting user settings");
      setSettings(null); // so as not to trigger consumers
      setUserCategories(null);
      setNotificationSettings(null); // so as not to trigger consumers
    }
  }, [isAuthenticated, isInitializing]);

  useEffect(() => {
    if (notificationSettings?.receive_notifications) {
      // register
      registerForNotifications();
    } else {
      // remove
      removeNotificationPermissions();
    }
  }, [notificationSettings]);

  //   useEffect(() => {
  //   if (user?.settings && !isEqual(user.settings, settings)) {
  //     setSettings(user.settings);
  //   }
  // }, [user?.settings]);

  const memoizedSettings = useMemo(() => {
    return user?.settings || {};
  }, [user]);

  //       setSettings(user.settings || {})
  // setNotificationSettings({
  //   receive_notifications: user.settings?.receive_notifications || false,
  // })

  const createNewCategoryMutation = useMutation({
    mutationFn: (data) => createUserCategory(user?.id, data),
    onSuccess: (data) => {
     

      // Update local state
      setUserCategories((prev) => [...prev, data]);

      // Update cached userSettings with logs
      queryClient.setQueryData(["userSettings", user?.id], (oldData) => {
        // console.log('Cache before update:', oldData);
        if (!oldData) return oldData;

        const updatedData = {
          ...oldData,
          user_categories: [...(oldData.user_categories || []), data],
        };

        // console.log('Cache after update:', updatedData);
        return updatedData;
      });
    },
  });
  const updateSettingsMutation = useMutation({
    mutationFn: (data) =>
      updateUserAccessibilitySettings(user?.id, data.setting),
    onSuccess: (data) => {
      setSettings(data); // Assuming the API returns updated settings
      console.log("APP SETTNGS RESET");

      // queryClient.setQueryData(["fetchUser"], (oldData) => ({
      //   ...oldData,
      //   settings: data.settings,
      // }));
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data) => updateUserCategory(user?.id, data.id, data.updates),
    onSuccess: (data) => {
      setUserCategories((prev) => {
        const updated = prev.map((cat) => (cat.id === data.id ? data : cat));

        return updated;
      });

      queryClient.setQueryData(["userSettings", user?.id], (oldData) => {
        console.log("Before updating cached userSettings:", oldData);

        if (!oldData) return oldData;

        const updatedUserSettings = {
          ...oldData,
          user_categories: oldData.user_categories.map((cat) =>
            cat.id === data.id ? data : cat
          ),
        };

        console.log("After updating cached userSettings:", updatedUserSettings);
        return updatedUserSettings;
      });
    },

    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (data) => deleteUserCategory(user?.id, data.id),
onSuccess: (data) => {
  // console.log("Deleted category data:", data);

  setUserCategories((prev) =>
    prev.filter((category) => category.id !== data.id)
  );

  queryClient.setQueryData(["userSettings", user?.id], (oldData) => {
    if (!oldData) return oldData;

    const updatedData = {
      ...oldData,
      user_categories: oldData.user_categories.filter(
        (category) => category.id !== data.id
      ),
    };

    // Log after updating
    // console.log("Cache after delete update:", updatedData);

    return updatedData;
  });
},


    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });
  const updateSettings = async (newSettings) => {
    console.log('updating settings!');
    try {
      await updateSettingsMutation.mutateAsync({
        // userId: user.user.id, // User ID
        fieldUpdates: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const createNewCategory = async (newCategoryData) => {
    try {
      const updatedData = await createNewCategoryMutation.mutateAsync(newCategoryData);
      
      if (updatedData) {
        console.log(`in createNewCategory`, updatedData);
        return updatedData;
      } 

    } catch (error) {
      console.error("Error creating new category: ", error);
    }
  };

  const updateCategory = async (categoryData) => {
    try {
      await updateCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const deleteCategory = async (categoryData) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const registerForNotifications = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        await SecureStore.setItemAsync("pushToken", pushTokenString);
        await updateUserAccessibilitySettings(user.id, {
          receive_notifications: true,
          expo_push_token: pushTokenString,
        });
        console.log("UPDATED USER SETTINGS WITH NOTIFICATION SETTINGS");
      }
    }
  };

  const removeNotificationPermissions = async () => {
    await SecureStore.deleteItemAsync("pushToken");
    if (user) {
      await updateUserAccessibilitySettings(user.id, {
        receive_notifications: false,
        expo_push_token: null,
      });
    }
  };

  useEffect(() => {
    if (!user?.authenticated || !settings) return;

    const fetchInitialSettings = async () => {
      console.log("SCREEN READER CONTEXT");
      try {
        const isActive = await AccessibilityInfo.isScreenReaderEnabled();

        setSettings((prevSettings) => {
          // only update if value has changed
          if (prevSettings.screen_reader !== isActive) {
            return { ...prevSettings, screen_reader: isActive };
          }
          return prevSettings;
        });
      } catch (error) {
        console.error("Error fetching initial screen reader status:", error);
      }
    };

    fetchInitialSettings();
  }, [user?.authenticated, settings]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     return;
  //   }

  //   const screenReaderListener = AccessibilityInfo.addEventListener(
  //     "screenReaderChanged",

  //     async (isActive) => {
  //       console.log("SCREEN READER GLOBAL STYLE");
  //       if (user) {
  //         updateAppSettingsMutation.mutate({
  //           userId: user.id,
  //           setting: { screen_reader: isActive },
  //         });
  //       }
  //     }
  //   );
  //   return () => {
  //     screenReaderListener.remove();
  //   };
  // }, [isAuthenticated]);

  //working on removing and replacing with RQ mutation directly
  //this is mainly used in SectionSettingsAccessibility
  // const updateUserAccessibility = async (updates) => {
  //   try {
  //     //await updateUserAccessibilitySettings(authUserState.user.id, updates);
  //     updateSettingsMutation.mutate({
  //       ...userAppSettings,
  //       ...updates,
  //     });
  //   } catch (error) {
  //     console.error("Error updating user settings:", error);
  //   }
  // };


  const contextValue = useMemo(() => ({
  settings,
  userCategories,
  createNewCategory,
  createNewCategoryMutation,
  updateCategory,
  updateCategoryMutation,
  deleteCategory,
  deleteCategoryMutation,
  notificationSettings,
  updateSettings,
  updateSettingsMutation,
  updateNotificationSettings: setNotificationSettings,
}), [
  settings,
  userCategories,
  createNewCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation,
  notificationSettings,
  updateSettingsMutation,
]);


  return (
<UserSettingsContext.Provider value={contextValue}>
  {children}
</UserSettingsContext.Provider>

  );
};
