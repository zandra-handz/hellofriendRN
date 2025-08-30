import { View, Text } from "react-native";
import React, { useRef } from "react";
import { createLocation } from "@/src/calls/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string;
};

const useCreateLocation = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);
  const createLocationMutation = useMutation({
    mutationFn: (data) => createLocation(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["locationList", userId], (old) => {
        const updatedList = old ? [data, ...old] : [data];
        return updatedList;
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createLocationMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error(error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createLocationMutation.reset();
      }, 2000);
    },
    // onSettled: () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }
    //   timeoutRef.current = setTimeout(() => {
    //     createLocationMutation.reset();
    //   }, 2000);
    // },
  });

  const handleCreateLocation = async (
    friends,
    title,
    address,
    parkingTypeText,
    trimmedCustomTitle,
    personalExperience
  ) => {
    const locationData = {
      user: userId,
      friends: friends,
      title: title,
      address: address,
      parking_score: parkingTypeText,
      custom_title: trimmedCustomTitle || Date.now(), // unique constraint on this per user on the backend
      personal_experience_info: personalExperience,
    };

    console.log('Payload before sending:', locationData);

    try {
      await createLocationMutation.mutateAsync(locationData); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  return {
    handleCreateLocation,
    createLocationMutation,
  };
};

export default useCreateLocation;
