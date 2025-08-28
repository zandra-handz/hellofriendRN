import { useRef } from "react";
import {
  fetchFriendImagesByCategory,
  createFriendImage,
  updateFriendImage,
  deleteFriendImage,
} from "@/src/calls/api";  
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 
  

type Props = {
  userId: number;

  friendId: number;
}

const useCreateImage = ({userId, friendId}: Props) => {
 
 
  const queryClient = useQueryClient();
  // const { showMessage } = useMessage();
  

  const timeoutRef = useRef(null);

 // make caching more efficient
  const createImageMutation = useMutation({
    mutationFn: (formData) => createFriendImage(friendId, formData), // Use the imported function
    onSuccess: () => {
      // showMessage(true, null, "Image uploaded!");
      queryClient.invalidateQueries(["friendImages"]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createImageMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // showMessage(true, null, "Oops! Error uploading image");
      console.error("Error uploading image:", error);
      timeoutRef.current = setTimeout(() => {
        createImageMutation.reset();
      }, 2000);
    },
  });

  const createImage = (formData) => {
    if (!friendId) {
        console.log('oops, no friend selected');
        return;
    }

    createImageMutation.mutate(formData);
  };

  return { 
    createImage,
    createImageMutation,
  };
};

export default useCreateImage;
