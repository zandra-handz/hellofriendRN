import { useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

type Props = {
  userId: number;
};

const useUpdateFriendName = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const updateFriendName = (friendId: number, newName: string) => {
    queryClient.setQueryData(
      ["friendListAndUpcoming", userId],
      (old: { friends: Friend[]; upcoming: any[]; next?: Friend } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          friends: old.friends.map((friend) =>
            friend.id === friendId ? { ...friend, name: newName } : friend
          ),
        };
      }
    );
  };

  return { updateFriendName };
};

export default useUpdateFriendName;