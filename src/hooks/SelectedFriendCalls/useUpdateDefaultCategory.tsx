import { View, Text } from "react-native";
import React, {
 
  useRef,
} from "react"; 
import {   useQueryClient, useMutation } from "@tanstack/react-query";
import { FriendDashboardData } from "@/src/types/FriendTypes";

import { updateFriendDefaultCategory } from "@/src/calls/api";

interface DefaultCategoryUpdateLoad {
  userId: number;
  friendId: number;

  categoryId: number;
}

interface DefaultCategoryUpdateProps {
  categoryId: number;
}

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateDefaultCategory = ({ userId, friendId }: Props) => {

      const queryClient = useQueryClient();
    
        const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleUpdateDefaultCategory = ({
    categoryId,
  }: DefaultCategoryUpdateProps) => {
    if (!userId || !friendId) {
      return;
    }

    const categoryUpdate: DefaultCategoryUpdateLoad = {
      userId: userId,

      friendId: friendId,
      categoryId: categoryId,
    };

    try {
      updateFriendDefaultCategoryMutation.mutate(categoryUpdate);
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  const updateFriendDefaultCategoryMutation = useMutation({
    mutationFn: (data: DefaultCategoryUpdateLoad) =>
      updateFriendDefaultCategory(data),

    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendDefaultCategoryMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<FriendDashboardData>(
        ["friendDashboardData", userId, friendId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            friend_faves: {
              ...oldData.friend_faves,
              friend_default_category: data.friend_default_category,
            },
          };
        }
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendDefaultCategoryMutation.reset();
      }, 2000);
    },
  });
  return { handleUpdateDefaultCategory, updateFriendDefaultCategoryMutation };
};

export default useUpdateDefaultCategory;
