import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineLiveSeshInvite } from "@/src/calls/api";

type Props = {
  userId: number;
};

const useDeclineLiveSeshInvite = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const declineMutation = useMutation({
    mutationFn: (inviteId: number) => declineLiveSeshInvite(inviteId),
    onSuccess: (data) => {
      console.log("declineLiveSeshInvite success:", data);
      queryClient.refetchQueries({ queryKey: ["liveSeshInvites", userId] });
    },
    onError: (error: Error) => {
      console.error("Error declining live sesh invite:", error);
    },
  });

  const handleDeclineInvite = async (inviteId: number) => {
    try {
      await declineMutation.mutateAsync(inviteId);
    } catch (error) {
      console.error("Error in handleDeclineInvite:", error);
    }
  };

  return {
    handleDeclineInvite,
    declineMutation,
  };
};

export default useDeclineLiveSeshInvite;