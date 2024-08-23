import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';
import ItemViewFooter from './ItemViewFooter'; 
import AlertImage from '../components/AlertImage';
import ButtonSendImageToFriend from '../components/ButtonSendImageToFriend';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import { updateFriendImage, deleteFriendImage } from '../api';

import AlertConfirm from '../components/AlertConfirm'; 
import AlertSuccessFail from '../components/AlertSuccessFail';

const ItemViewImage = ({ image, onClose }) => {
  const { selectedFriend } = useSelectedFriend();
  const { imageList, setUpdateImagesTrigger } = useImageList();
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
      await updateFriendImage(image.friendId, image.id, { title });
      setIsEditing(false); 
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const toggleModal = () => {
    setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const imageToDelete = imageList[currentIndex];  // Get the correct image to delete based on currentIndex
      await deleteFriendImage(selectedFriend.id, imageToDelete.id);  // Delete the correct image
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
    setUpdateImagesTrigger(prev => !prev);
    setSuccessModalVisible(false);
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
    setTitle(imageList[currentIndex]?.title || '');
  }, [currentIndex]);

  return (
    <>
      <AlertImage
        isModalVisible={isModalVisible}
        toggleModal={closeModal}
        modalContent={
          imageList[currentIndex] ? (
            <View style={styles.modalContainer}>
              <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <View style={styles.infoContainer}>
                    <View style={styles.detailsColumn}>
                      <Text style={styles.name}>{imageList[currentIndex].title}</Text>
                      <View style={styles.modalImageContainer}>
                        <Image
                          source={{ uri: imageList[currentIndex].image }}
                          style={styles.modalImage}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.navigationContainer}>
                  <TouchableOpacity 
                    onPress={goToPreviousImage} 
                    disabled={currentIndex === 0}
                    style={styles.arrowButton}
                  >
                    <ArrowLeftCircleOutlineSvg width={40} height={40} color={currentIndex === 0 ? 'gray' : 'black'} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={goToNextImage} 
                    disabled={currentIndex === imageList.length - 1}
                    style={styles.arrowButton}
                  >
                    <ArrowRightCircleOutlineSvg width={40} height={40} color={currentIndex === imageList.length - 1 ? 'gray' : 'black'} />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <ItemViewFooter
                    buttons={[
                      { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black' />, onPress: handleEdit },
                      { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: toggleModal },
                    ]}
                    maxButtons={2} 
                    showLabels={false}
                  />
                  <ButtonSendImageToFriend onPress={handleUpdate} friendName={selectedFriend.name} />
                </View>
              </View>
            </View>
          ) : null
        }
        modalTitle="View Image"
      />

      <AlertConfirm
        fixedHeight={true}
        height={330}
        isModalVisible={isConfirmDeleteModalVisible}
        questionText="Delete image? (This can't be reversed!)"
        isFetching={isDeleting}
        useSpinner={true}
        toggleModal={toggleModal}
        headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{imageList[currentIndex].title}</Text>}
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
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  detailsColumn: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 4,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  modalImageContainer: {
    width: '100%',
    height: '80%',
    marginBottom: 10,
    borderRadius: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 0,
    borderRadius: 10,
  },
  navigationContainer: {
    flexDirection: 'row', 
    position: 'absolute',
    width: '100%', 
    top: '40%',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  arrowButton: {
    padding: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default ItemViewImage;
