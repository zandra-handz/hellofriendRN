import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveMomentAPI } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useCreateMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const handleCreateMoment = async (momentData) => { 
 
    const moment = {
       user: userId,
 
      friend: momentData.friend,
  capsule: momentData.moment,
      user_category: momentData.selectedUserCategory,
    };

    try {
      await createMomentMutation.mutateAsync(moment);
    } catch (error) {
      console.error("Error saving moment:", error);
    }
  };

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveMomentAPI(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
      }, 500);
    },
    onSuccess: (data) => {
      const formattedMoment = {
        id: data.id,
        typedCategory: data.typed_category || "Uncategorized",
        capsule: data.capsule,
        created: data.created_on,
        preAdded: data.pre_added_to_hello,
        user_category: data.user_category || null,
        user_category_name: data.user_category_name || null,
      };
 

      queryClient.setQueryData(
        ["Moments", userId, friendId],
        (old) => (old ? [formattedMoment, ...old] : [formattedMoment])
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
      }, 500);
    },
  });


  return {
    handleCreateMoment,
    createMomentMutation,
  };
};

export default useCreateMoment;
