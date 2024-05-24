import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Button } from 'react-native';
import CardGen from '../components/CardGen';
import CardStatus from '../components/CardStatus';
import { useCapsuleList } from '../context/CapsuleListContext';
import NextHello from '../data/FriendDashboardData';
import DaysSince from '../data/FriendDaysSince';
import CardToggler from '../components/CardToggler';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendImagesByCategory } from '../api';

const baseURL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

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
            // Construct the correct image URL
            const imageUrl = image.image.startsWith('http')
              ? image.image
              : baseURL + image.image;

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

        setImages(flattenedImages);
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

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.image }}
          style={styles.footerImage}
        />
      ))}
    </View>
  );

  return (
    <View>
      <FlatList
        ListHeaderComponent={(
          <>
            <CardStatus
              title={<NextHello />}
              rightTitle={<DaysSince />}
              description=""
              showFooter={false}
            />
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
  tabContent: {
    padding: 0,
  },
  footerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  footerImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});

export default TabScreenFriend;
