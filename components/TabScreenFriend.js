import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons'; // Import FontAwesome5

import CardGen from '../components/CardGen';
import CardMoment from '../components/CardMoment';
import CardToggler from '../components/CardToggler';
import AlertImage from '../components/AlertImage';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendImagesByCategory, updateFriendImage, deleteFriendImage } from '../api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const windowWidth = Dimensions.get('window').width;

const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

const endColor = [25, 90, 25];
const startColor = [190, 255, 0];

const getGradientColor = (index, total) => {
  const factor = (index / (total - 1)) * 2;
  const clampedFactor = Math.min(factor, 1);
  return interpolateColor(startColor, endColor, clampedFactor);
};

const TabScreenFriend = () => {
  const { capsuleList } = useCapsuleList();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const { selectedFriend } = useSelectedFriend();

  const fetchImages = async () => {
    if (selectedFriend) {
      try {
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

        setImages([...flattenedImages]);
      } catch (error) {
        console.error('Error fetching friend images by category:', error);
      }
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setTitle(image.title); // Initialize title state
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
    setIsEditing(false); // Reset editing state
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (selectedFriend && selectedImage) {
      try {
        await updateFriendImage(selectedFriend.id, selectedImage.id, { title });
        setSelectedImage(prev => ({ ...prev, title }));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating image:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedFriend && selectedImage) {
      try {
        await deleteFriendImage(selectedFriend.id, selectedImage.id);
        setImages(images.filter(image => image.id !== selectedImage.id));
        closeModal();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleShare = async () => {
    if (selectedImage) {
      const imageUrl = selectedImage.image;
      const fileUri = FileSystem.documentDirectory + selectedImage.title + '.jpg';
  
      try {
        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
        await Sharing.shareAsync(uri);
  
        // After successful sharing, delete the image
        await deleteFriendImage(selectedFriend.id, selectedImage.id);
        setImages(images.filter(image => image.id !== selectedImage.id));
        closeModal(); // Close the modal or perform other actions
      } catch (error) {
        console.error('Error sharing image:', error);
      }
    }
  };
  

  const categories = Array.from(new Set(capsuleList.map(capsule => capsule.typedCategory)));

  const renderFooter = () => {
    const imagesByCategory = images.reduce((acc, image) => {
      if (!acc[image.image_category]) {
        acc[image.image_category] = [];
      }
      acc[image.image_category].push(image);
      return acc;
    }, {});

    return (
      <View style={styles.imageContainer}>
        {Object.keys(imagesByCategory).map(category => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.imageRow}>
              {imagesByCategory[category].map((image, index) => (
                <TouchableOpacity key={index} onPress={() => openModal(image)}>
                  <Image
                    source={{ uri: image.image }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={(
          <> 
          </>
        )}
        data={categories}
        renderItem={({ item: category }) => (
          <View key={category}>
            <CardToggler
              title={category}
              onPress={() => toggleCategory(category)}
            />
            {expandedCategories[category] && (
              capsuleList
                .filter(capsule => capsule.typedCategory === category)
                .map((capsule, index) => (
                  <CardMoment
                    key={index}
                    title={capsule.typedCategory}
                    description={capsule.capsule}
                    showIcon={true}
                    iconColor={getGradientColor(index, capsuleList.length)}
                    capsule={capsule}
                  />
                ))
            )}
          </View>
        )}
        keyExtractor={(category, index) => index.toString()}
        contentContainerStyle={styles.tabContent}
        ListFooterComponent={renderFooter}
      />

      <AlertImage
        isModalVisible={isModalVisible}
        toggleModal={closeModal}
        modalContent={
          selectedImage ? (
            <View>
              <Image
                source={{ uri: selectedImage.image }}
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
                  <Text style={styles.modalText}>{selectedImage.title}</Text>
                  <TouchableOpacity onPress={handleEdit}>
                    <FontAwesome5 name="edit" size={24} color="blue" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <FontAwesome5 name="trash-alt" size={24} color="red" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare}>
                    <FontAwesome5 name="share" size={24} color="green" style={styles.icon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null
        }
        modalTitle="Image Details"
      />
      <Button title="Fetch Images" onPress={fetchImages} />
    </View>
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
  image: {
    width: windowWidth / 3 - 20,
    height: windowWidth / 3 - 20,
    margin: 5,
    borderRadius: 10,
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
});

export default TabScreenFriend;
