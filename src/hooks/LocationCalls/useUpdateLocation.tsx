import { View, Text } from "react-native";
import React, { useRef } from "react";
import { updateLocation } from "@/src/calls/api";
import {  useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string; 
//   locationUpdate: object;
};

const useUpdateLocation = ({ userId  }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

    const handleUpdateLocation = async ( locationId, locationUpdate) => {
   
  
      try {
        await updateLocationMutation.mutateAsync({
          id: locationId,
          ...locationUpdate,
        });
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };
  
    const updateLocationMutation = useMutation({
      mutationFn: ({ id, ...locationData }) => updateLocation(id, locationData),
      onSuccess: (data) => {
        queryClient.setQueryData(["locationList", userId], (old) => {
          if (!old) return [data];
          return old.map((location) =>
            location.id === data.id ? { ...location, ...data } : location
          );
        });
      },
      onError: (error) => {
        console.error("Update failed:", error);
      },
      onSettled: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          updateLocationMutation.reset();
        }, 2000);
      },
    });
  

  return {
    handleUpdateLocation,
    updateLocationMutation,
  };
};

export default useUpdateLocation;
