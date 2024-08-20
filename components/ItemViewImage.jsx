import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';
import ButtonSendImageToFriend from '../components/ButtonSendImageToFriend';

import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';

import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';


import { updateFriendImage, deleteFriendImage } from '../api';
import ItemViewFooter from './ItemViewFooter'; // Import your ItemViewFooter component
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ItemViewImage = ({ image, onClose }) => {
  const { selectedFriend } = useSelectedFriend();
  const { imageList, setImageList, updateImage, deleteImage } = useImageList();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      console.log('Image data:', image);
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
      updateImage(image.id);
      setIsEditing(false); // Reset editing state
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFriendImage(selectedFriend.id, image.id);
      deleteImage(image.id); // Delete image from imageList context
      closeModal(); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleShare = async () => {
    if (!image.image) {
      console.error('Error: Image URL is null or undefined');
      return;
    }

    const fileUri = FileSystem.documentDirectory + (image.title || 'shared_image') + '.jpg';

    try {
      const { uri } = await FileSystem.downloadAsync(image.image, fileUri);
      await Sharing.shareAsync(uri);

      // Add a delay to ensure the share sheet completes its process
      setTimeout(async () => {
        try {
          await deleteFriendImage(selectedFriend.id, image.id);
          deleteImage(image.id);
          closeModal();
        } catch (error) {
          console.error('Error deleting shared image:', error);
        }
      }, 500); // Delay in milliseconds, adjust as necessary

    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <AlertImage
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        image ? (
          <View style={styles.modalContainer}>

              <View style={styles.container}>
              <View style={styles.headerContainer}>

                <View style={styles.infoContainer}>
                
                <View style={styles.detailsColumn}>
                <View style={styles.detailRow}>
                <Text style={styles.name}>{image.title}</Text>
                </View>
                <View style={styles.detailRow}>
                <Text style={styles.name}>{image.id}</Text>
                </View>
                <View style={styles.detailRow}>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: image.image }}
                    style={styles.modalImage}
                  />
                </View>
                




                </View>
                  </View>
                </View>
              </View>

              </View>
              <View style={styles.buttonContainer}> 
              <View style={styles.footerContainer}>
              <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black'/>, onPress: handleEdit },
                    { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: handleDelete },
                    { label: 'Share', icon: <TrashOutlineSvg width={24} height={24} fill="green" />, onPress: handleShare },
                  ]}
                  maxButtons={2} 
                  showLabels={false}
                />
                </View>
              <ButtonSendImageToFriend onPress={handleShare} friendName={selectedFriend.name} /> 
              </View>
          </View>
        ) : null
      }
      modalTitle="View Image"
     
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,

    backgroundColor: 'pink',
  },
  detailsColumn: {
    backgroundColor: 'hotpink',
    flex: 1,
    flexDirection: 'column',
    marginRight: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 0,
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
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Add some padding if needed
    backgroundColor: 'lightgray', // Temporary background for debugging
  },
  
  buttonContainer: { 
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'pink',
    flexDirection: 'column',
    justifyContent: 'space-between', 
  },
});

export default ItemViewImage;
