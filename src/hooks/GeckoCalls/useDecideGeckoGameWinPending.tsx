import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../useUser";
import { decideGeckoGameWinPending } from "@/src/calls/api";

type Props = {
  userId: number;
}
const useDecideGeckoGameWinPending = ({userId} : Props) => {
 
  const queryClient = useQueryClient();

  const decideGeckoGameWinPendingMutation = useMutation({
    mutationFn: (decision: "accept" | "decline") =>
      decideGeckoGameWinPending(decision),
    onSuccess: (data) => {
      console.log("decideGeckoGameWinPending success:", data);
      queryClient.invalidateQueries({
        queryKey: ["geckoGameWinPending", userId ?? 0],
      });
      queryClient.invalidateQueries({
        queryKey: ["geckoGameWins", userId ?? 0],
      });
    },
    onError: (error) => {
      console.error("Error deciding gecko game win pending:", error);
    },
  });

  const decide = async (decision: "accept" | "decline") => {
    try {
      await decideGeckoGameWinPendingMutation.mutateAsync(decision);
    } catch (error) {
      console.error("Error deciding gecko game win pending:", error);
    }
  };

  return {
    decide,
    decideGeckoGameWinPendingMutation,
    isPending: decideGeckoGameWinPendingMutation.isPending,
  };
};

export default useDecideGeckoGameWinPending;
