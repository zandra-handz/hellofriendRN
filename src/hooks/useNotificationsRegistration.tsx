import { View, Text } from 'react-native'
import React, { useEffect} from 'react'

import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, AccessibilityInfo } from "react-native";

import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";


import {
  updateUserAccessibilitySettings,
  updateSubscription,
  getUserSettings,
} from "../calls/api";

type Props = {
  receiveNotifications: boolean;
}

const useNotificationsRegistration = ({receiveNotifications}: Props) => {


  if (receiveNotifications === undefined) {
    console.log('returning because receiveNotifications undefined');
    return;
  }


    useEffect(() => {
    async function registerOrRemove() {
        console.log('NEW HOK TRIGGGERED');
      if (receiveNotifications) {
        registerForNotifications();
      } else {
        removeNotificationPermissions();
      }
    }
    registerOrRemove();
  }, [receiveNotifications]);
 

  
  const registerForNotifications = async () => {
    console.warn('REGISTERING FOR NOTIFS!');
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
        await updateUserAccessibilitySettings( {
          receive_notifications: true,
          expo_push_token: pushTokenString,
        });
        console.log("UPDATED USER SETTINGS WITH NOTIFICATION SETTINGS");
      }
    }
  };

  const removeNotificationPermissions = async () => {
       console.warn('REMOVING NOTIFS!');
    await SecureStore.deleteItemAsync("pushToken");
    // if (user) {
      await updateUserAccessibilitySettings( {
        receive_notifications: false,
        expo_push_token: null,
      });
    // }
  };

  return {
    
  }
}

export default useNotificationsRegistration