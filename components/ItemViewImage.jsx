import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import ItemViewFooter from '../components/ItemViewFooter'; 
import AlertImage from '../components/AlertImage';
import ButtonSendImageToFriend from '../components/ButtonSendImageToFriend';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';

import AlertConfirm from '../components/AlertConfirm'; 
import AlertSuccessFail from '../components/AlertSuccessFail';

import NavigationArrows from '../components/NavigationArrows';

const ItemViewImage = ({ image, onClose }) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { imageList, updateImage, deleteImage } = useImageList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      const index = imageList.findIndex(img => img.id === image.id);
      setCurrentIndex(index);
    }
  }, [image]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };

  const handleUpdate = async () => {
    try {
      updateImage(image.id, { title });
      setIsEditing(false); 
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const toggleModal = () => {
    setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
  };

  const handleShare = async () => {
    if (!imageList[currentIndex]?.image) {
      console.error('Error: Image URL is null or undefined');
      return;
    }

    const fileUri = FileSystem.documentDirectory + (imageList[currentIndex].title || 'shared_image') + '.jpg';
    const message = "Check out this image!"; 

    try {
      const { uri } = await FileSystem.downloadAsync(imageList[currentIndex].image, fileUri);
      await Sharing.shareAsync(uri);
  
      setTimeout(async () => {
        try { 
          setConfirmDeleteModalVisible(true); 
        } catch (error) {
          console.error('Error deleting shared image:', error);
        }
      }, 500);  

    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const imageToDelete = imageList[currentIndex];  
      deleteImage(imageList[currentIndex].id);

      // Update currentIndex to prevent out-of-bounds access
      if (currentIndex >= imageList.length - 1) {
        setCurrentIndex(imageList.length - 2); // Move to the previous image
      }

      setSuccessModalVisible(true);  
    } catch (error) {
      setFailModalVisible(true);
      console.error('Error deleting image:', error);
    } finally {
      setConfirmDeleteModalVisible(false);
      setIsDeleting(false);
    }
  };

  const successOk = () => {
    setSuccessModalVisible(false);
    closeModal();
  };

  const failOk = () => { 
    setFailModalVisible(false);
  };

  const goToPreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (currentIndex < imageList.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (imageList[currentIndex]) {
      setTitle(imageList[currentIndex].title || '');
    } else {
      setTitle(''); // Clear title if currentIndex is out of bounds
    }
  }, [currentIndex]);

  return (
    <>
      <AlertImage
        isModalVisible={isModalVisible}
        toggleModal={closeModal}
        modalContent={
          imageList[currentIndex] ? (
            <View style={styles.modalContainer}> 
                <View style={styles.headerContainer}>
                <Text style={[styles.imageTitle, themeStyles.subHeaderText]}>{imageList[currentIndex].title}</Text>
                </View>
                <View style={[styles.modalImageContainer, themeStyles.textGenericBackgroundShadeTwo]}>
                    <Image
                      source={{ uri: imageList[currentIndex].image }}
                      style={styles.modalImage}
                    />
                </View> 
                <NavigationArrows 
                  currentIndex={currentIndex}
                  imageListLength={imageList.length}
                  onPrevPress={goToPreviousImage}
                  onNextPress={goToNextImage}
                /> 
                <ItemViewFooter
                  buttons={[
                    { label: 'Edit', buttonIconSize: 34, buttonPurpose: 'edit', icon: <EditOutlineSvg width={34} height={34} color={themeStyles.genericText.color} />, onPress: handleEdit },
                    { label: 'Delete', buttonIconSize: 34, buttonPurpose: 'delete', icon: <TrashOutlineSvg width={34} height={34} color={themeStyles.genericText.color} />, onPress: toggleModal },
                  ]}
                  maxButtons={4} 
                  showLabels={false}
                  alignment='right'
                  padding={40}
                /> 
                <ButtonSendImageToFriend onPress={handleShare} friendName={selectedFriend.name} />
            </View>
          ) : null
        }
        modalTitle="View Image"
      />

      <AlertConfirm
        fixedHeight={true}
        height={330}
        isModalVisible={isConfirmDeleteModalVisible}
        questionText="Delete image?"
        isFetching={isDeleting}
        useSpinner={true} 
        headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{imageList[currentIndex]?.title || 'Image'}</Text>}
        onConfirm={() => handleDelete()} 
        onCancel={toggleModal}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <AlertSuccessFail
        isVisible={isSuccessModalVisible}
        message='Image has been deleted.'
        onClose={successOk}
        type='success'
      />

      <AlertSuccessFail
        isVisible={isFailModalVisible}
        message='Error deleting image.'
        onClose={failOk}
        tryAgain={false} 
        isFetching={isDeleting}
        type='failure'
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%', 
    justifyContent: 'space-between',
  }, 
  headerContainer: {
    height: '6%',
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center', 
  },  
  imageTitle: {
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  modalImageContainer: {
    width: '100%', 
    height: '80%', 
    borderRadius: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 0,
    borderRadius: 10,
  },  
  buttonContainer: {  
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default ItemViewImage;
