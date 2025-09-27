import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserAccessibilitySettings } from "@/src/calls/api";

type Props = {
  userId: number;
};

const useUpdateSettings = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => updateUserAccessibilitySettings(data.setting),
onSuccess: (serverData, variables) => {
  // variables.setting = the object you passed in (the delta)
  const updates = variables.setting;

  queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
    if (!oldData) return serverData; // if no cache, fallback to server response
    return {
      ...oldData,
      ...updates, // only apply the fields we changed
    };
  });
 
      // console.log("APP SETTINGS RESET");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateSettingsMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateSettingsMutation.reset();
      }, 2000);
      console.error("Update app settings error:", error);
    },
  });

  const updateSettings = async (newSettings) => {
    console.log("updating settings! (function in updateSettings)", newSettings);
    try {
      await updateSettingsMutation.mutateAsync({
        // userId: user.user.id, // User ID
        setting: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  return {
    updateSettings,
    updateSettingsMutation,
  };
};

export default useUpdateSettings;
