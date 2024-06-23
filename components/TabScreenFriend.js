import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Button, Dimensions, Text } from 'react-native';
import CardGen from '../components/CardGen';
import CardStatus from '../components/CardStatus';
import CardToggler from '../components/CardToggler';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendImagesByCategory } from '../api';

const windowWidth = Dimensions.get('window').width;

// Base URL for your S3 bucket
// const s3BaseUrl = 'https://hfriendbucket.s3.us-east-2.amazonaws.com/';

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
  const { selectedFriend } = useSelectedFriend();

  const fetchImages = async () => {
    if (selectedFriend) {
      try {
        const imagesData = await fetchFriendImagesByCategory(selectedFriend.id);

        // Flatten the nested imagesData into an array of image objects
        const flattenedImages = [];
        Object.keys(imagesData).forEach(category => {
          imagesData[category].forEach(image => {
            // Remove '/media' from the front of the image name
            let imagePath = image.image;
            if (imagePath.startsWith('/media/')) {
              imagePath = imagePath.substring(7);  // Remove '/media/' prefix
            }
 
            const imageUrl = imagePath;

            // Add the image object with the full URL to the flattened array
            flattenedImages.push({
              ...image,
              image: imageUrl,
              image_category: category,
            });
          });
        });

        // Log the required fields for each image
        flattenedImages.forEach(image => {
          console.log(`Category: ${image.image_category}, Title: ${image.title}, Image URL: ${image.image}`);
        });

        setImages([...flattenedImages]); // Ensure new array reference for state update
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

  const categories = Array.from(new Set(capsuleList.map(capsule => capsule.typedCategory)));

  const renderFooter = () => {
    // Group images by category
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
                <Image
                  key={index}
                  source={{ uri: image.image }}
                  style={styles.image}
                />
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
          <CardStatus
            title="Next Hello"
            rightTitle="Days Since"
            description=""
            showFooter={false}
          />
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
                  <CardGen
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
    justifyContent: 'center',
  },
  image: {
    width: windowWidth / 3 - 20,
    height: windowWidth / 3 - 20,
    margin: 5,
    borderRadius: 10,
  },
});

export default TabScreenFriend;
