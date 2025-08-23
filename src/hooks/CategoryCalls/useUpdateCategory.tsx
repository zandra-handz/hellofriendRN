import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserCategory } from "@/src/calls/api";

type Props = {
  userId: number;
};

const useUpdateCategory = ({ userId }: Props) => {
  const queryClient = useQueryClient();
      const timeoutRef = useRef(null);
  
  const handleSyncStats = () => {
    queryClient.refetchQueries({ queryKey: ["userStats"] });
    queryClient.refetchQueries({ queryKey: ["selectedFriendStats"] });
  };

  const updateCategoryMutation = useMutation({
    mutationFn: (data) => updateUserCategory(userId, data.id, data.updates),
    onSuccess: (data) => {
 

      queryClient.setQueryData(["categories", userId], (oldData: any[]) => {
        if (!oldData) return oldData;
        console.log(oldData.map((cat) => (cat.id === data.id ? data : cat)));
        return oldData.map((cat) => (cat.id === data.id ? data : cat));
      });
         handleSyncStats();

            if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateCategoryMutation.reset();
      }, 1000);


    },

    onError: (error) => {
      console.error("Update app categories error:", error);
                  if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateCategoryMutation.reset();
      }, 1000);
    },
  });
  const updateCategory = async (categoryData) => {
    try {
      await updateCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app categories:", error);
    }
  };

  return { updateCategory, updateCategoryMutation };
};

export default useUpdateCategory;
