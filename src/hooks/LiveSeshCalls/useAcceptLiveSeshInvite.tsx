import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptLiveSeshInvite } from "@/src/calls/api";

type Props = {
  userId: number;
};

const useAcceptLiveSeshInvite = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (inviteId: number) => acceptLiveSeshInvite(inviteId),
    onSuccess: (data) => {
      console.log("acceptLiveSeshInvite success:", data);
      queryClient.refetchQueries({ queryKey: ["liveSeshInvites", userId] });
      queryClient.refetchQueries({ queryKey: ["currentLiveSesh", userId] });
    },
    onError: (error: Error) => {
      console.error("Error accepting live sesh invite:", error);
    },
  });

  const handleAcceptInvite = async (inviteId: number) => {
    try {
      await acceptMutation.mutateAsync(inviteId);
    } catch (error) {
      console.error("Error in handleAcceptInvite:", error);
    }
  };

  return {
    handleAcceptInvite,
    acceptMutation,
  };
};

export default useAcceptLiveSeshInvite;
