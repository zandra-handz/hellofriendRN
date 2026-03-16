// import React, { useRef } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import { deleteUserCategory } from "@/src/calls/api";

// type Props = {
//   userId: number;
// };

// const useDeleteCategory = ({ userId }: Props) => {
//   const queryClient = useQueryClient();
//   const timeoutRef = useRef(null);

//   const handleSyncStats = () => {
//     queryClient.refetchQueries({ queryKey: ["userStats"] });
//     queryClient.refetchQueries({ queryKey: ["selectedFriendStats"] });
//   };

//   const deleteCategoryMutation = useMutation({
//     mutationFn: (data) => deleteUserCategory(userId, data.id),
//     onSuccess: (data) => {
//       handleSyncStats();

//       queryClient.setQueryData(["categories", userId], (oldData: any[]) => {
//         if (!oldData) return oldData;

//         return oldData.filter((cat) => cat.id !== data.id);
//       });
//     },

//     onError: (error) => {
//       console.error("Update app categories error:", error);
//     },
//   });

//   const deleteCategory = async (categoryData) => {
//     try {
//       await deleteCategoryMutation.mutateAsync(categoryData);
//     } catch (error) {
//       console.error("Error updating app categories:", error);
//     }
//   };

//   return { deleteCategory, deleteCategoryMutation };
// };

// export default useDeleteCategory;


import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserCategory } from "@/src/calls/api";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  userId: number;
};

const useDeleteCategory = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const handleSyncStats = () => {
    queryClient.refetchQueries({ queryKey: ["userStats"] });
    queryClient.refetchQueries({ queryKey: ["selectedFriendStats"] });
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: (data) => deleteUserCategory(userId, data.id),
    onSuccess: (data) => {

         showFlashMessage(`Category deleted`, false, 1000);
      handleSyncStats();

      queryClient.setQueryData(["categories", userId], (oldData: any[]) => {
        if (!oldData) return oldData;
        return oldData.filter((cat) => cat.id !== data.id);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        deleteCategoryMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showFlashMessage(`Category not deleted`, true, 1000);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        deleteCategoryMutation.reset();
      }, 2000);
      console.error("Update app categories error:", error);
    },
  });

  const deleteCategory = async (categoryData) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app categories:", error);
    }
  };

  return { deleteCategory, deleteCategoryMutation };
};

export default useDeleteCategory;