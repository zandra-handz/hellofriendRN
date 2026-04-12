import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLiveSeshInvite } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useCreateLiveSeshInvite = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: () => createLiveSeshInvite(friendId),
    onSuccess: (data) => {
      console.log("createLiveSeshInvite success:", data);
      queryClient.refetchQueries({ queryKey: ["liveSeshInvites", userId] });
      queryClient.refetchQueries({ queryKey: ["currentLiveSesh", userId] });
    },
    onError: (error: Error) => {
      console.error("Error creating live sesh invite:", error);
    },
  });

  const handleCreateInvite = async () => {
    try {
      await inviteMutation.mutateAsync();
    } catch (error) {
      console.error("Error in handleCreateInvite:", error);
    }
  };

  return {
    handleCreateInvite,
    inviteMutation,
  };
};

export default useCreateLiveSeshInvite;
