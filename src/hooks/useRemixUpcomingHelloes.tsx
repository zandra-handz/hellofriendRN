 
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remixAllNextHelloes } from "../calls/api";
import { useUser } from "../context/UserContext";

export const useRemixUpcomingHelloes = ({userId}) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
const { user } = useUser();
  const remixMutation = useMutation({
    mutationFn: () => remixAllNextHelloes(userId),
    onSuccess: () => {
  
      queryClient.refetchQueries({ queryKey: ["upcomingHelloes", userId] });

 
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
