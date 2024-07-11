

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

import { updateFriendImage, deleteFriendImage } from '../api';
import AlertImage from '../components/AlertImage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import ItemViewFooter from './ItemViewFooter'; // Import your ItemViewFooter component

const ItemViewImage = ({ image, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [includeTag, setIncludeTag] = useState(false);

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
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFriendImage(image.friendId, image.id);
      onClose();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const addTagToImage = async (uri) => {
    try {
      const result = await manipulateAsync(
        uri,
        [
          {
            resize: { width: 500, height: 500 },
          },
          {
            drawText: {
              text: 'sent via hellofriend!',
              position: { x: 10, y: 450 },
              color: 'white',
              fontSize: 20,
              anchor: 'bottomLeft',
            },
          },
        ],
        { format: SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Error adding tag to image:', error);
      return uri; // Return the original uri if there's an error
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

      let imageUri = uri;
      if (includeTag) {
        imageUri = await addTagToImage(uri);
      }

      await Sharing.shareAsync(imageUri);

      await deleteFriendImage(image.friendId, image.id);
      onClose();
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
                  onClose={onClose}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  includeTag={includeTag}
                  setIncludeTag={setIncludeTag}
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
    marginRight: 10,
  },
});

export default ItemViewImage;
