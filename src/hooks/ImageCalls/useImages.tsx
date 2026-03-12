 
// import {
//   fetchFriendImagesByCategory,
 
// } from "@/src/calls/api";   
// import { useQuery  } from "@tanstack/react-query";
 
  

// type Props = {
//   userId: number;

//   friendId: number;
// }

// const useImages = ({userId, friendId, enabled=true}: Props) => {
 
  

//   const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
//     queryKey: ["friendImages", userId, friendId],
//     queryFn: () => fetchFriendImagesByCategory(friendId),
//     enabled: !!(friendId && userId && enabled), // testng removing this && !isInitializing), 
//     staleTime: 1000 * 60 * 20, // 20 minutes
//     select: (imagesData) => { 
//       const flattenedImages = [];
//       Object.keys(imagesData).forEach((category) => {
//         imagesData[category].forEach((image) => {
//           let imagePath = image.image;
//           if (imagePath.startsWith("/media/")) {
//             imagePath = imagePath.substring(7);
//           }
//           flattenedImages.push({
//             ...image,
//             image: imagePath,
//             image_category: category,
//           });
//         });
//       });
//       return flattenedImages;
//     },
//   });

 
 
//   return {
//     imageList, 
//     isImageContextLoading,
 
//   };
// };

// export default useImages;

import { fetchFriendImagesByCategory } from "@/src/calls/api";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type Props = {
  userId: number;
  friendId: number;
  enabled?: boolean;
};

const friendImagesQueryOptions = (userId: number, friendId: number) => ({
  queryKey: ["friendImages", userId, friendId],
  queryFn: () => fetchFriendImagesByCategory(friendId),
  enabled: !!(friendId && userId),
  staleTime: 1000 * 60 * 20,
});

const useImages = ({ userId, friendId, enabled = true }: Props) => {
  const selectFn = useCallback((imagesData) => {
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
  }, []);

  const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
    ...friendImagesQueryOptions(userId, friendId),
    enabled: !!(friendId && userId && enabled),
    select: selectFn,
  });

  return {
    imageList,
    isImageContextLoading,
  };
};

export default useImages;
