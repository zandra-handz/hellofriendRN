import React, { createContext, useContext, useRef } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchFriendImagesByCategory, createFriendImage, updateFriendImage, deleteFriendImage } from '../api'; // Adjust the import path as needed
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ImageListContext = createContext({ imageList: [], imageCount: 0, isLoading: true });

export const useImageList = () => {
    const context = useContext(ImageListContext);

    if (!context) {
        throw new Error('useImageList must be used within an ImageListProvider');
    }

    return context;
};

export const ImageListProvider = ({ children }) => {
    const { selectedFriend } = useSelectedFriend();
    const queryClient = useQueryClient(); 


    const { data: imageList = [], isLoading: isImageContextLoading } = useQuery({
        queryKey: ['friendImages', selectedFriend?.id],
        queryFn: () => fetchFriendImagesByCategory(selectedFriend.id),
        enabled: !!selectedFriend, // Only run query if selectedFriend is available
        select: (imagesData) => {
            // Flattening the images
            const flattenedImages = [];
            Object.keys(imagesData).forEach(category => {
                imagesData[category].forEach(image => {
                    let imagePath = image.image;
                    if (imagePath.startsWith('/media/')) {
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
        mutationFn: (imageData) => updateFriendImage(selectedFriend.id, imageData.id, imageData.updatedData), // Pass friendId and imageId
        onSuccess: () => {
            queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
        
        },
        onError: (error) => {
            console.error('Error updating image:', error);
        },
    });

    const updateImage = (id, updatedData) => {
        updateImageMutation.mutate({ id, updatedData });
    };
 
    const deleteImageMutation = useMutation({
        mutationFn: (id) => deleteFriendImage(selectedFriend.id, id), // Pass friendId and imageId
        onSuccess: () => { 

            queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
 
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


            console.error('Error deleting image:', error);
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
            queryClient.invalidateQueries(['friendImages', selectedFriend?.id]);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

 
            timeoutRef.current = setTimeout(() => {
                createImageMutation.reset(); 
              }, 2000);
        },
        onError: (error) => {
            console.error('Error creating friend image:', error);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }


            console.error('Error deleting image:', error);
            timeoutRef.current = setTimeout(() => {
                createImageMutation.reset(); 
              }, 2000);
        },
    });

    const createImage = (formData) => {
        
        createImageMutation.mutate(formData);
    };

    return (
        <ImageListContext.Provider value={{ 
            imageList, 
            imageCount,
            isImageContextLoading,
            updateImage, 
            deleteImage,
            deleteImageMutation,
            createImage,
            createImageMutation,
        }}>
            {children}
        </ImageListContext.Provider>
    );
};
