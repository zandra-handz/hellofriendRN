import { useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { saveHello } from "@/src/calls/api";

import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  userId: number;
};
import { formatDate } from "date-fns"; //NOT SURE IF THIS IS THE RIGHT IMPORT
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const useCreateHello = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const { deselectFriend } = useSelectedFriend();

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

    onSuccess: async (data, variables) => {
 
      showFlashMessage(`Hello saved!`, false, 2000);
      const friendId = variables.friend;
      const { hello, hello_light } = data;

      queryClient.setQueryData(["pastHelloes", userId, variables.friend], (old) => {
        return old ? [hello_light, ...old] : [hello_light];
      });

      // queryClient.setQueryData(["pastHelloes", userId, friendId], (old) => {
      //   const updatedHelloes = old ? [normalized, ...old] : [normalized];
      //   return updatedHelloes;
      // });

      // testing whether want to do it this way
      await queryClient.invalidateQueries({
        queryKey: ["Moments", userId, friendId],
      });

      await queryClient.refetchQueries({
        queryKey: ["friendListAndUpcoming", userId],
      });
      await queryClient.refetchQueries({ queryKey: ["userStats", userId] });
      await queryClient.refetchQueries({ queryKey: ["userSettings", userId] });
      deselectFriend();
      queryClient.setQueryData(
        ["autoSelectTrigger"],
        (old: number = 0) => old + 1,
      );

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },

    // onSuccess: (data, variables) => {
    //   showFlashMessage(`Hello saved!`, false, 2000);
    //   const friendId = variables.friend;
    //   const normalized = {
    //     ...data,
    //     dateLong: data.date,
    //     date: data.past_date_in_words || formatDate(data.date),
    //   };

    //   queryClient.setQueryData(["pastHelloes", userId, friendId], (old) => {
    //     const updatedHelloes = old ? [normalized, ...old] : [normalized];
    //     return updatedHelloes;
    //   });

    //   queryClient.refetchQueries({
    //     queryKey: ["friendListAndUpcoming", userId],
    //   });
    //   queryClient.refetchQueries({ queryKey: ["userStats", userId] });
    //   queryClient.refetchQueries({ queryKey: ["userSettings", userId] });

    //   // THIS MUST COME AFTER USER SETTINGS REFETCH, TO TRIGGER AUTOSELECT AFTER WE HAVE NEW SETTINGS DATA
    //   queryClient.setQueryData(['autoSelectTrigger'], (old: number = 0) => old + 1)

    //   // need this for this hook but not for remix
    //   deselectFriend();

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
