import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showFlashMessage } from "../utils/ShowFlashMessage";
import { devResetEnergy } from "@/src/calls/api";

const useDevResetEnergy = () => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const devResetEnergyMutation = useMutation({
    mutationFn: () => devResetEnergy(),
    onSuccess: (data) => {
      showFlashMessage(`Energy reset!`, false, 1000);
      console.log("Dev reset energy successful.", data);
      queryClient.refetchQueries({ queryKey: ["userGeckoScoreState"] });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        devResetEnergyMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showFlashMessage(`Energy reset failed`, false, 1000);
      console.error("Error resetting energy:", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        devResetEnergyMutation.reset();
      }, 2000);
    },
  });

  const handleDevResetEnergy = async () => {
    showFlashMessage(`Resetting energy...`, false, 1000);
    try {
      await devResetEnergyMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error("Error in handleDevResetEnergy:", error);
      return false;
    }
  };

  return {
    handleDevResetEnergy,
    devResetEnergyMutation,
  };
};

export default useDevResetEnergy;
