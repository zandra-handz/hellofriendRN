import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Button, Image } from 'react-native';
import ButtonLottieAnimationSatellitesImages from './ButtonLottieAnimationSatellitesImages';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendImagesByCategory, updateFriendImage, deleteFriendImage } from '../api'; // Import API functions here
import ItemImageMulti from '../components/ItemImageMulti';

const ActionFriendPageImages = ({ onPress }) => { 
  const { selectedFriend } = useSelectedFriend();
  const [imageData, setImageData] = useState([]);

  let mainImage = null;
  let satelliteImages = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalImages = [];

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

        setImageData(flattenedImages); 
      } catch (error) {
        console.error('Error fetching friend images by category:', error);
      }
    }
  };

  useEffect(() => {
    fetchImages();
    console.log(imageData);
  }, [selectedFriend]);

  if (imageData.length > 0) {
    
    mainImage = imageData[0];
    console.log("WOOOOOOOOOOOOOOOOOOOOOOOO", mainImage);
    satelliteImages = imageData.slice(1);
    additionalSatelliteCount = satelliteImages.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalImages = satelliteImages.slice(satellitesFirstPage + 1);
      additionalImages = imageData;
      console.log('additionalImages: ', additionalImages);
    } else {
      additionalImages = null;
    }
  }


  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [title, setTitle] = useState(''); // State for image title



  // Open modal function
  const openModal = (image) => {
    setSelectedImage(image);
    setTitle(image.title); // Initialize title state
    setIsModalVisible(true);
  };

  
  const handlePress = (image) => { 
    console.log('IMAGE!!', image); 
  };

  return (
    <View style={styles.container}> 
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
           
          <ButtonLottieAnimationSatellitesImages
            onPress={() => handlePress(mainImage)} 
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageData ? imageData : `Can't get all data`}
            additionalText={mainImage ? mainImage.title : 'Loading...'}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={require('../assets/shapes/greenfloral.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteImages}
            satellitesOrientation="horizontal"
            satelliteHeight="100%"
            additionalPages={showSecondButton}
            additionalSatellites={additionalImages}
            satelliteOnPress={(image) => handlePress(image)} 
          /> 
        ) : (
          <ButtonLottieAnimationSatellitesImages
            onPress={() => handlePress(mainImage)}
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageData ? imageData : `Can't get all data`}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteImages}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(image) => handlePress(image)} 
          />
        )}
      </Animated.View>
      

      {!showSecondButton && additionalSatelliteCount > 0 && (
        <TouchableOpacity onPress={() => setShowSecondButton(true)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      )}

      {showSecondButton && (
        <TouchableOpacity onPress={() => setShowSecondButton(false)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  container: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 10,
    marginRight: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ActionFriendPageImages;
