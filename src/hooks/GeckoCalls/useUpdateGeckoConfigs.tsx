import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserGeckoConfigs } from "@/src/calls/api";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  userId: number;
};

const useUpdateGeckoConfigs = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const updateGeckoConfigsMutation = useMutation({
    mutationFn: (data) => updateUserGeckoConfigs(data.setting),
    onSuccess: (serverData, variables) => {
      showFlashMessage(`Gecko settings updated!`, false, 1000);
      console.log("updating gecko configs!", serverData);

      queryClient.setQueryData(["userGeckoConfigs", userId], (oldData: any) => {
        if (!oldData) return serverData;
        return {
          ...oldData,
          ...serverData,
        };
      });

      queryClient.refetchQueries({
        queryKey: ["userGeckoScriptsData", userId],
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateGeckoConfigsMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showFlashMessage(`Gecko settings not updated`, true, 1000);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateGeckoConfigsMutation.reset();
      }, 2000);
      console.error("Update gecko configs error:", error);
    },
  });

  const updateGeckoConfigs = async (newConfigs) => {
    try {
      await updateGeckoConfigsMutation.mutateAsync({
        setting: newConfigs,
      });
    } catch (error) {
      console.error("Error updating gecko configs:", error);
    }
  };

  return {
    updateGeckoConfigs,
    updateGeckoConfigsMutation,
  };
};

export default useUpdateGeckoConfigs;
