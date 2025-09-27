 
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remixAllNextHelloes } from "../calls/api";
 
export const useRemixUpcomingHelloes = ({userId}) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 
  const remixMutation = useMutation({
    mutationFn: () => remixAllNextHelloes(userId),
    onSuccess: () => {
  
      queryClient.refetchQueries({ queryKey: ["friendListAndUpcoming", userId] }); //do we want it to refetch the friends too?

 
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
