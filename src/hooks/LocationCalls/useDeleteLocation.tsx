import { View, Text } from "react-native";
import React, { useRef } from "react";
import { deleteLocation } from "@/src/calls/api";
import {  useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string;
  locationId: string;
};

const useDeleteLocation = ({ userId, locationId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const deleteLocationMutation = useMutation({
    mutationFn: (data) => deleteLocation(data),

    onSuccess: (data) => {
      queryClient.setQueryData(["locationList", userId], (old) => {
        const updatedList = old
          ? old.filter((location) => location.id !== data.id)
          : [];
        return updatedList;
      });

      //   queryClient.invalidateQueries(["locationList", userId]);
    },
    onError: (error) => {
      console.error("Error deleting location:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        deleteLocationMutation.reset();
      }, 2000);
    },
  });

  const handleDeleteLocation = async () => {
    try {
      await deleteLocationMutation.mutateAsync(locationId); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  return {
    handleDeleteLocation,
    deleteLocationMutation,
  };
};

export default useDeleteLocation;
