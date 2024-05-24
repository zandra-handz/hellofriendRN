import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendImagesByCategory } from '../api'; // Import the new API function

const FriendImages = () => {
    const { selectedFriend } = useSelectedFriend();
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [selectedImageId, setSelectedImageId] = useState(null); // State to store the selected image ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the new API function to fetch images by category
        const imagesData = await fetchFriendImagesByCategory(selectedFriend.id);
        setImagesByCategory(imagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setImagesByCategory({});
      }
    };

    fetchData();
  }, [selectedFriend]); // Include selectedFriend in the dependencies array

  const handleImageClick = (imageId) => {
    setSelectedImageId(imageId); // Set the selected image ID
  };

  return (
    <View>
      {Object.keys(imagesByCategory).length > 0 && (
        Object.keys(imagesByCategory).map(category => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <FlatList
              data={imagesByCategory[category]}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleImageClick(item.id)}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        ))
      )}
      {/* Add modal or any other component to show detailed image */}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
  },
});

export default FriendImages;
