import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideGeckoGameMatchWinPending } from "@/src/calls/api";

type Decision = "accept" | "decline";

type DecideGeckoGameMatchWinPendingArgs = {
  pendingId: number;
  decision: Decision;
};

const useDecideGeckoGameMatchWinPending = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: decideGeckoGameMatchWinPendingAsync,
    isPending: decideGeckoGameMatchWinPendingIsPending,
    isSuccess: decideGeckoGameMatchWinPendingIsSuccess,
    isError: decideGeckoGameMatchWinPendingIsError,
    data: decideGeckoGameMatchWinPendingData,
  } = useMutation({
    mutationFn: ({ pendingId, decision }: DecideGeckoGameMatchWinPendingArgs) =>
      decideGeckoGameMatchWinPending(pendingId, decision),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["geckoGameWinPending"],
      });

      queryClient.invalidateQueries({
        queryKey: ["geckoGameWins"],
      });
    },
  });

  return {
    decideGeckoGameMatchWinPendingAsync,
    decideGeckoGameMatchWinPendingIsPending,
    decideGeckoGameMatchWinPendingIsSuccess,
    decideGeckoGameMatchWinPendingIsError,
    decideGeckoGameMatchWinPendingData,
  };
};

export default useDecideGeckoGameMatchWinPending;