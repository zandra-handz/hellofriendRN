import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelCurrentLiveSesh } from "@/src/calls/api";

type Props = {
  userId: number;
};

const useCancelCurrentLiveSesh = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => cancelCurrentLiveSesh(),
    onSuccess: (data) => {
      console.log("cancelCurrentLiveSesh success:", data);
      queryClient.refetchQueries({ queryKey: ["currentLiveSesh", userId] });
      queryClient.refetchQueries({ queryKey: ["liveSeshInvites", userId] });
    },
    onError: (error: Error) => {
      console.error("Error canceling current live sesh:", error);
    },
  });

  const handleCancelCurrentLiveSesh = async () => {
    try {
      await cancelMutation.mutateAsync();
    } catch (error) {
      console.error("Error in handleCancelCurrentLiveSesh:", error);
    }
  };

  return {
    handleCancelCurrentLiveSesh,
    cancelMutation,
  };
};

export default useCancelCurrentLiveSesh;