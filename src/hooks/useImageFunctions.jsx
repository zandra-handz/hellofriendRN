import { useRef } from "react";
import {
  fetchFriendImagesByCategory,
  createFriendImage,
  updateFriendImage,
  deleteFriendImage,
} from "@/src/calls/api";  
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";  
import { useMessage } from "@/src/context/MessageContext";
import { useUser } from "../context/UserContext";

const useImageFunctions = () => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();

  const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
    queryKey: ["friendImages", user?.id, selectedFriend?.id],
    queryFn: () => fetchFriendImagesByCategory(selectedFriend.id),
    enabled: !!(selectedFriend && isAuthenticated && !isInitializing), 
    staleTime: 1000 * 60 * 20, // 20 minutes
    select: (imagesData) => { 
      const flattenedImages = [];
      Object.keys(imagesData).forEach((category) => {
        imagesData[category].forEach((image) => {
          let imagePath = image.image;
          if (imagePath.startsWith("/media/")) {
            imagePath = imagePath.substring(7);
          }
          flattenedImages.push({
            ...image,
            image: imagePath,
            image_category: category,
          });
        });
      });
      return flattenedImages;
    },
  });

  const imageCount = imageList.length;

  const timeoutRef = useRef(null);

  const updateImageMutation = useMutation({
    mutationFn: (imageData) =>
      updateFriendImage(selectedFriend.id, imageData.id, imageData.updatedData), // Pass friendId and imageId
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

  const deleteImageMutation = useMutation({
    mutationFn: (id) => deleteFriendImage(selectedFriend.id, id), // Pass friendId and imageId
    onSuccess: () => {
      showMessage(true, null, "Image deleted!");
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
      showMessage(true, null, "Oops! Image not deleted");
      timeoutRef.current = setTimeout(() => {
        deleteImageMutation.reset();
      }, 2000);
    },
  });

  const deleteImage = (id) => {
    deleteImageMutation.mutate(id);
  };

  const createImageMutation = useMutation({
    mutationFn: (formData) => createFriendImage(selectedFriend.id, formData), // Use the imported function
    onSuccess: () => {
      showMessage(true, null, "Image uploaded!");
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

      showMessage(true, null, "Oops! Error uploading image");
      console.error("Error uploading image:", error);
      timeoutRef.current = setTimeout(() => {
        createImageMutation.reset();
      }, 2000);
    },
  });

  const createImage = (formData) => {
    createImageMutation.mutate(formData);
  };

  return {
    imageList,
    imageCount,
    isImageContextLoading,
    updateImage,
    deleteImage,
    deleteImageMutation,
    createImage,
    createImageMutation,
  };
};

export default useImageFunctions;
