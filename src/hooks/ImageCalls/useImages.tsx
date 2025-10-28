 
import {
  fetchFriendImagesByCategory,
 
} from "@/src/calls/api";  
import React, { useMemo } from "react";
import { useQuery  } from "@tanstack/react-query";
 
  

type Props = {
  userId: number;

  friendId: number;
}

const useImages = ({userId, friendId, enabled=true}: Props) => {
 
  

  const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
    queryKey: ["friendImages", userId, friendId],
    queryFn: () => fetchFriendImagesByCategory(friendId),
    enabled: !!(friendId && userId && enabled), // testng removing this && !isInitializing), 
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

 
 
  return {
    imageList, 
    isImageContextLoading,
 
  };
};

export default useImages;
