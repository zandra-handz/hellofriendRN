import { useRef } from "react";
import { 
  deleteFriendImage,
} from "@/src/calls/api";  
import { useMutation, useQueryClient } from "@tanstack/react-query";
 
  

type Props = {
  userId: number;

  friendId: number;
}

const useDeleteImage = ({userId, friendId}: Props) => {
 
 
  const queryClient = useQueryClient();
 

  const timeoutRef = useRef(null);

 
// make caching more efficient
  const deleteImageMutation = useMutation({
    mutationFn: (id) => deleteFriendImage(friendId, id), // Pass friendId and imageId
    onSuccess: () => {
      // showMessage(true, null, "Image deleted!");
      queryClient.invalidateQueries(["friendImages"]);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteImageMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error deleting image:", error);
      // showMessage(true, null, "Oops! Image not deleted");
      timeoutRef.current = setTimeout(() => {
        deleteImageMutation.reset();
      }, 2000);
    },
  });

  const deleteImage = (id) => {
    deleteImageMutation.mutate(id);
  };
 
  return {  
    deleteImage,
    deleteImageMutation,
  };
};

export default useDeleteImage;
