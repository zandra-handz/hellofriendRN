import { useRef } from "react";
import { 
  updateFriendImage, 
} from "@/src/calls/api";  
import {  useMutation, useQueryClient } from "@tanstack/react-query";
 
  

type Props = {
  userId: number;

  friendId: number;
}


//not in use yet but would be the one to use! (8/27/2025)
const useUpdateImage = ({userId, friendId}: Props) => {
 
 
  const queryClient = useQueryClient(); 

 

  const timeoutRef = useRef(null);


  // make caching more efficient
  const updateImageMutation = useMutation({
    mutationFn: (imageData) =>
      updateFriendImage(friendId, imageData.id, imageData.updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["friendImages"]);
    },
    onError: (error) => {
      console.error("Error updating image:", error);
    },
  });

  const updateImage = (id, updatedData) => {
    updateImageMutation.mutate({ id, updatedData });
  };
 

  
 

  return { 
    updateImage, 
    updateImageMutation,
  };
};

export default useUpdateImage;
