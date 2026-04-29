import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  userId: number;
  friendId: number | null;
};

type Moment = {
  id: string | number;
  capsule_category?: string;
  category_name?: string;
};

const useRemoveMomentFEOnly = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const { removeFromUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({
    userId,
  });

  const handleRemoveMoment = useCallback(
    (capsuleId: string | number) => {
      if (!friendId || !userId) {
        console.log(
          `useRemoveMomentFEOnly skipped, missing ids`,
          userId,
          friendId
        );
        return;
      }

      const queryKey = ["Moments", userId, friendId];

      const oldMoments = queryClient.getQueryData<Moment[]>(queryKey) ?? [];

      const removedMoment = oldMoments.find(
        (moment) => String(moment.id) === String(capsuleId)
      );

      const capsuleCategory =
        removedMoment?.capsule_category ?? removedMoment?.category_name;

      queryClient.setQueryData<Moment[]>(queryKey, (old = []) =>
        old.filter((moment) => String(moment.id) !== String(capsuleId))
      );

      if (capsuleCategory) {
        removeFromUpcomingCapsuleSummary({
          friend_id: friendId,
          category_name: capsuleCategory,
        });
      }

      showFlashMessage(`Moment removed!`, false, 1000);
    },
    [friendId, queryClient, removeFromUpcomingCapsuleSummary, userId]
  );

  return {
    handleRemoveMoment,
  };
};
export default useRemoveMomentFEOnly;