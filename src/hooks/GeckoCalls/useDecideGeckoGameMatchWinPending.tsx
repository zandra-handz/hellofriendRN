import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideGeckoGameMatchWinPending } from "@/src/calls/api";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
type Decision = "accept" | "decline";

type Args = {
  pendingId: number;
  decision: Decision;
};

const useDecideGeckoGameMatchWinPending = () => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: ({ pendingId, decision }: Args) =>
      decideGeckoGameMatchWinPending(pendingId, decision),

    onSuccess: (_serverData, variables) => {
        console.log(`_serverData: `, _serverData)

        if (_serverData && _serverData?.accepted) {
            showFlashMessage(`Accepted!`, false, 1000)
        }

          if (_serverData && !_serverData?.accepted) {
            showFlashMessage(`Declined`, false, 1000)
        }
      queryClient.invalidateQueries({
        queryKey: ["geckoGameMatchWinPending", variables.pendingId],
      });

      queryClient.invalidateQueries({
        queryKey: ["geckoGameWinPending"],
      });

      queryClient.invalidateQueries({
        queryKey: ["geckoGameWins"],
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        mutation.reset();
      }, 2000);
    },

    onError: (error) => {
      console.error("Decide gecko game match win pending error:", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        mutation.reset();
      }, 2000);
    },
  });

  return {
    decide: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    reset: mutation.reset,
  };
};

export default useDecideGeckoGameMatchWinPending;