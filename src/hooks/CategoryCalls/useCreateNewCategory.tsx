import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createUserCategory } from "@/src/calls/api";

type Props = {
  userId: string;
};

const useCreateNewCategory = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const handleSyncStats = () => {
    queryClient.refetchQueries({ queryKey: ["userStats"] });
    queryClient.refetchQueries({ queryKey: ["selectedFriendStats"] });
  };

  const createNewCategoryMutation = useMutation({
    mutationFn: (data) => createUserCategory(userId, data),
    onSuccess: (data) => {
      // setUserCategories((prev) => [...prev, data]);

      queryClient.setQueryData(["categories", userId], (oldData: any[]) => {
        if (!oldData) return [data];

        handleSyncStats();

        const updatedList = [...oldData, data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        return updatedList;
      });
    },
  });

  const createNewCategory = async (newCategoryData) => {
    try {
      const updatedData =
        await createNewCategoryMutation.mutateAsync(newCategoryData);

      if (updatedData) {
        console.log(`in createNewCategory`, updatedData);
        return updatedData;
      }
    } catch (error) {
      console.error("Error creating new category: ", error);
    }
  };

  return { createNewCategory, createNewCategoryMutation };
};

export default useCreateNewCategory;
