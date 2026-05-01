import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptLiveSeshInvite } from "@/src/calls/api";

type Props = {
  userId: number;
};

type AcceptLiveSeshInviteArgs = {
  inviteId: number;
  geckoPlayMode: number;
};

const useAcceptLiveSeshInvite = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: ({ inviteId, geckoPlayMode }: AcceptLiveSeshInviteArgs) =>
      acceptLiveSeshInvite(inviteId, geckoPlayMode),

    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ["liveSeshInvites", userId] });
      queryClient.refetchQueries({ queryKey: ["currentLiveSesh", userId] });
    },

    onError: (error: Error) => {
      console.error("Error accepting live sesh invite:", error);
    },
  });

  const handleAcceptInvite = async (
    inviteId: number,
    geckoPlayMode: number
  ) => {
    try {
      await acceptMutation.mutateAsync({
        inviteId,
        geckoPlayMode,
      });
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