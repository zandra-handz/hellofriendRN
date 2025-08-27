import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { saveHello } from "@/src/calls/api";
type Props = {
  userId: number;
  // friendId: number;
};
import { formatDate } from "date-fns";  //NOT SURE IF THIS IS THE RIGHT IMPORT

const useCreateHello = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const createHelloMutation = useMutation({
    mutationFn: (data) => saveHello(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    onSuccess: (data, variables) => {
      const friendId = variables.friend;
      const normalized = {
        ...data,
        dateLong: data.date,
        date: data.past_date_in_words || formatDate(data.date),
      };

      queryClient.setQueryData(["pastHelloes", userId, friendId], (old) => {
        const updatedHelloes = old ? [normalized, ...old] : [normalized];
        return updatedHelloes;
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    // onSuccess: (data) => {
    //   const normalized = {
    //     ...data,
    //     dateLong: data.date, // or format if needed
    //     date: data.past_date_in_words || formatDate(data.date), // optional
    //   };

    //   queryClient.setQueryData(
    //     ["pastHelloes", user?.id, selectedFriend?.id],
    //     (old) => {
    //       const updatedHelloes = old ? [normalized, ...old] : [normalized];
    //       return updatedHelloes;
    //     }
    //   );

    //   // const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
    //   //console.log("Actual HelloesList after mutation:", actualHelloesList);

    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = setTimeout(() => {
    //     createHelloMutation.reset();
    //   }, 2000);
    // },
  });

  const handleCreateHello = (helloData) => {
    const hello = {
      user: userId,
      friend: helloData.friend,
      type: helloData.type,
      typed_location: helloData.manualLocation,
      additional_notes: helloData.notes,
      location: helloData.locationId,
      date: helloData.date,
      thought_capsules_shared: helloData.momentsShared,
      delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
    };

    try {
      createHelloMutation.mutate(hello);
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  return { handleCreateHello, createHelloMutation };
};

export default useCreateHello;
