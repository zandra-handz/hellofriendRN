// ImageListContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelectedFriend } from './SelectedFriendContext'; // Adjust the import path as needed
import { fetchFriendImagesByCategory } from '../api'; // Adjust the import path as needed

const ImageListContext = createContext({ imageList: [], setImageList: () => {} });

export const useImageList = () => {
    const context = useContext(ImageListContext);

    if (!context) {
        throw new Error('useImageList must be used within an ImageListProvider');
    }

    return context;
};

export const ImageListProvider = ({ children }) => {
    const { selectedFriend } = useSelectedFriend();
    const [imageList, setImageList] = useState([]);
    const [isImageContextLoading, setIsImageContextLoading] = useState(true);
    const [updateImagesTrigger, setUpdateImagesTrigger] = useState(false); // Introducing updateTrigger state
    

    useEffect(() => {
        const fetchData = async () => {
            if (selectedFriend) {
                try {
                    setIsImageContextLoading(true);
                    const imagesData = await fetchFriendImagesByCategory(selectedFriend.id);
                    const flattenedImages = [];

                    Object.keys(imagesData).forEach(category => {
                        imagesData[category].forEach(image => {
                            let imagePath = image.image;
                            if (imagePath.startsWith('/media/')) {
                                imagePath = imagePath.substring(7);
                            }
                            const imageUrl = imagePath;

                            flattenedImages.push({
                                ...image,
                                image: imageUrl,
                                image_category: category,
                            });
                        });
                    });

                    setImageList(flattenedImages);
                } catch (error) {
                    console.error('Error fetching friend images by category:', error);
                } finally {
                    setIsImageContextLoading(false);
                }
            } else {
                setImageList([]);
            }
        };

        fetchData();
    }, [selectedFriend, updateImagesTrigger]);

    const updateImage = (id, updatedData) => {
        setImageList(prevList => 
            prevList.map(image => image.id === id ? { ...image, ...updatedData } : image)
        );
    };

    const deleteImage = (id) => {
        setImageList(prevList => prevList.filter(image => image.id !== id));
    };

    return (
        <ImageListContext.Provider value={{ 
            imageList, 
            setImageList, 
            updateImage, 
            deleteImage,
            isImageContextLoading,
            updateImagesTrigger, 
            setUpdateImagesTrigger,  
        }}>
            {children}
        </ImageListContext.Provider>
    );
};
