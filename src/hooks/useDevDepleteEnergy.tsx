import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showFlashMessage } from "../utils/ShowFlashMessage";
import { devDepleteEnergy } from "@/src/calls/api";

const useDevDepleteEnergy = () => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const devDepleteEnergyMutation = useMutation({
    mutationFn: () => devDepleteEnergy(),
    onSuccess: (data) => {
      showFlashMessage(`Energy depleted!`, false, 1000);
      console.log("Dev deplete energy successful.", data);
      queryClient.refetchQueries({ queryKey: ["userGeckoScoreState"] });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        devDepleteEnergyMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showFlashMessage(`Energy deplete failed`, false, 1000);
      console.error("Error depleting energy:", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        devDepleteEnergyMutation.reset();
      }, 2000);
    },
  });

  const handleDevDepleteEnergy = async () => {
    showFlashMessage(`Depleting energy...`, false, 1000);
    try {
      await devDepleteEnergyMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error("Error in handleDevDepleteEnergy:", error);
      return false;
    }
  };

  return {
    handleDevDepleteEnergy,
    devDepleteEnergyMutation,
  };
};

export default useDevDepleteEnergy;
