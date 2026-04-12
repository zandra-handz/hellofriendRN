import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkUserToFriendWithCode } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useLinkUserToFriend = ({ userId, friendId }: Props) => {

   const queryClient = useQueryClient();
  const linkMutation = useMutation({
    mutationFn: (code: string) => linkUserToFriendWithCode(friendId, code),
    onSuccess: (data) => {
      console.log("linkUserToFriend success:", data);

       queryClient.refetchQueries({queryKey: ["friendDashboardData", userId, friendId]})
      
    },
    onError: (error: Error) => {
      console.error("Error linking user to friend:", error);
    },
  });

  const handleLinkUser = async (code: string) => {
    try {
      await linkMutation.mutateAsync(code);
    } catch (error) {
      console.error("Error in handleLinkUser:", error);
    }
  };

  return {
    handleLinkUser,
    linkMutation,
  };
};

export default useLinkUserToFriend;
