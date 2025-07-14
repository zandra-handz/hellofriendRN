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
  receiveNotifications: boolean | string; // 'not ready' if settings aren't ready yet
  expoPushToken: string | null | 'not ready';
};

const useNotificationsRegistration = ({ receiveNotifications, expoPushToken }: Props) => {
  useEffect(() => {
    async function registerOrRemove() {
      console.log("NEW HOK TRIGGGERED");

      if (receiveNotifications !== true && receiveNotifications !== false) {
        return; // Don't do anything if not ready
      }

      if (receiveNotifications) {
        await registerForNotifications();
      } else {
        await removeNotificationPermissions();
      }
    }

    registerOrRemove();
  }, [receiveNotifications, expoPushToken]);

  const registerForNotifications = async () => {
    console.warn("REGISTERING FOR NOTIFS!");

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return;

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    // ✅ Skip update if backend already has same token
    if (expoPushToken === pushTokenString) {
      console.log("No changes needed — push token matches backend");
      return;
    }

    await SecureStore.setItemAsync("pushToken", pushTokenString);

    await updateUserAccessibilitySettings({
      receive_notifications: true,
      expo_push_token: pushTokenString,
    });

    console.log("UPDATED USER SETTINGS WITH NOTIFICATION SETTINGS");
  };

  const removeNotificationPermissions = async () => {
    console.warn("REMOVING NOTIFS!");

    // ✅ Only call update if backend doesn't already have null
    if (expoPushToken === null && receiveNotifications === false) {
      console.log("No changes needed — notifications already off");
      return;
    }

    await SecureStore.deleteItemAsync("pushToken");

    await updateUserAccessibilitySettings({
      receive_notifications: false,
      expo_push_token: null,
    });

    console.log("UPDATED USER SETTINGS TO REMOVE NOTIFICATIONS");
  };

  return {};
};

export default useNotificationsRegistration;
