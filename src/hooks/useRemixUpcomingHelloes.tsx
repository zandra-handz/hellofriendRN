import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remixAllNextHelloes } from "../calls/api";
// import { useSelectedFriend } from "../context/SelectedFriendContext";

// this view updates the user too, so it does not matter what order we refetch userSettings in
export const useRemixUpcomingHelloes = ({ userId }) => {
  // const { deselectFriend} = useSelectedFriend();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const remixMutation = useMutation({
    mutationFn: () => remixAllNextHelloes(userId),
    onSuccess: async (data) => {
      // console.log("remixAllNextHelloes response:", data);

      await queryClient.refetchQueries({
        queryKey: ["friendListAndUpcoming", userId],
      }); //do we want it to refetch the friends too?
      await queryClient.refetchQueries({ queryKey: ["userSettings", userId] });

      // THIS MUST COME AFTER USER SETTINGS REFETCH, TO TRIGGER AUTOSELECT AFTER WE HAVE NEW SETTINGS DATA
      queryClient.setQueryData(
        ["autoSelectTrigger"],
        (old: number = 0) => old + 1,
      );
      //  deselectFriend();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        remixMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        remixMutation.reset();
      }, 2000);
    },
  });

  const handleRemixAllNextHelloes = () => {
    try {
      remixMutation.mutate();
    } catch (error) {
      console.error("Error remixing helloes:", error);
    }
  };

  return {
    remixMutation,
    handleRemixAllNextHelloes,
  };
};
