 
import { useQueryClient } from "@tanstack/react-query";
 

import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";

type Props = {
  userId: number;
  friendId: number;
};

const useRemoveMomentFEOnly = ({ userId, friendId }: Props) => {
 

  const queryClient = useQueryClient();

  const { removeFromUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({
    userId: userId,
  });

  const handleRemoveMoment = async (capsuleId, capsuleCategory) => {
    queryClient.setQueryData(["Moments", userId, friendId], (old) => {
      return old ? old.filter((moment) => moment.id !== capsuleId) : [];
    });

    removeFromUpcomingCapsuleSummary({
      friend_id: friendId,
      category_name: capsuleCategory,
    });
  };

  return {
    handleRemoveMoment,
  };
};

export default useRemoveMomentFEOnly;
