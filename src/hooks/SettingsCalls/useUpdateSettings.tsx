import React from "react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserAccessibilitySettings } from "@/src/calls/api";

type Props = {
    userId: number;
};

const useUpdateSettings = ({userId}: Props) => {
  const queryClient = useQueryClient();

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => updateUserAccessibilitySettings(data.setting),
    onSuccess: (data) => {
      // ✅ update the cache so consumers re-render immediately
      queryClient.setQueryData(["userSettings", userId], data);

      // console.log("APP SETTINGS RESET");
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const updateSettings = async (newSettings) => {
    console.log("updating settings!", newSettings);
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
