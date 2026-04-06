import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "./useUser";
import { showFlashMessage } from "../utils/ShowFlashMessage";
import { updateGeckoScoreState } from "@/src/calls/api";

const useUpdateGeckoScoreState = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const timeoutRef = useRef(null);

  const updateGeckoScoreStateMutation = useMutation({
    mutationFn: (fieldUpdates: object) => updateGeckoScoreState(fieldUpdates),
    onSuccess: (data) => {
      showFlashMessage(`Score state saved!`, false, 1000);
      queryClient.setQueryData(
        ["userGeckoScoreState", user?.id ?? 0],
        () => data,
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateGeckoScoreStateMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showFlashMessage(`Score state not saved`, false, 1000);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateGeckoScoreStateMutation.reset();
      }, 2000);
    },
  });

  const handleUpdateGeckoScoreState = async (fieldUpdates: object) => {
    showFlashMessage(`Saving score state...`, false, 1000);

    try {
      await updateGeckoScoreStateMutation.mutateAsync(fieldUpdates);
      return true;
    } catch (error) {
      console.error("Error updating gecko score state:", error);
      return false;
    }
  };

  return {
    handleUpdateGeckoScoreState,
    updateGeckoScoreStateMutation,
  };
};

export default useUpdateGeckoScoreState;
