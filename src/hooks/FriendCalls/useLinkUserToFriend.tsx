import { useMutation } from "@tanstack/react-query";
import { linkUserToFriendWithCode } from "@/src/calls/api";

type Props = {
  friendId: number;
};

const useLinkUserToFriend = ({ friendId }: Props) => {
  const linkMutation = useMutation({
    mutationFn: (code: string) => linkUserToFriendWithCode(friendId, code),
    onSuccess: (data) => {
      console.log("linkUserToFriend success:", data);
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
