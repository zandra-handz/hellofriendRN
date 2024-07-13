import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';

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
          <View>
            <Image
              source={{ uri: image.image }}
              style={styles.modalImage}
            />
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                />
                <Button title="Update" onPress={handleUpdate} />
                <Button title="Cancel" onPress={() => setIsEditing(false)} />
              </>
            ) : (
              <>
                <Text style={styles.modalText}>{title}</Text>
                <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: 'edit', color: 'blue', onPress: handleEdit },
                    { label: 'Delete', icon: 'trash-alt', color: 'red', onPress: handleDelete },
                    { label: 'Share', icon: 'share', color: 'green', onPress: handleShare },
                  ]}
                />
              </>
            )}
          </View>
        ) : null
      }
      modalTitle="Image Details"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    padding: 0,
  },
  imageContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
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
  icon: {
    marginHorizontal: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
  },
});

export default ItemViewImage;
