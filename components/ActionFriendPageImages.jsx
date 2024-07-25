import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Button, Image } from 'react-native';
import ButtonLottieAnimationSatellitesImages from './ButtonLottieAnimationSatellitesImages';
import { useImageList } from '../context/ImageListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';

import ActionFriendPageAllImages from '../components/ActionFriendPageAllImages';
 

const ActionFriendPageImages = ({ onPress }) => { 
  
  const { selectedFriend } = useSelectedFriend();
  const { imageList, setImageList } = useImageList();
  const [isFSModalVisible, setIsFSModalVisible] = useState(false);
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

  let mainImage = null;
  let satelliteImages = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalImages = [];

  let overrideView = true;

  if (imageList.length > 0) {
    console.log('IMAGE CONTEXT', imageList);
    mainImage = imageList[0];
    satelliteImages = imageList.slice(1);
    additionalSatelliteCount = satelliteImages.length - satellitesFirstPage;
    
    if (additionalSatelliteCount > 0) {
      additionalImages = imageList.slice(satellitesFirstPage + 1);
    } else {
      additionalImages = null;
    }
  }

  const navigateToFirstPage = () => {
    setShowSecondButton(false);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };


  const handleNext = () => {
    setShowSecondButton(true);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleFullScreen = () => {
    setIsFSModalVisible(true); // Set modal visible when fullscreen button is pressed
  };

  const closeModal = () => {
    setIsFSModalVisible(false); // Close the modal
  };

  const handlePress = (image) => {
    // Handle moment press actions
    console.log('Selected Image:', image);
  };





  return (
    <View style={styles.container}> 
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 || overrideView ? (
           
          <ButtonLottieAnimationSatellitesImages
            onPress={() => handlePress(mainImage)} 
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageList ? imageList : `Can't get all data`}
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
            showShape={false}
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
            additionalSatellites={imageList}
            satelliteOnPress={(image) => handlePress(image)} 
          /> 
        ) : (
          <ButtonLottieAnimationSatellitesImages
            onPress={() => handlePress(mainImage)}
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageList ? imageList : `Can't get all data`}
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
            showShape={false}
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
      

      {((!showSecondButton && additionalSatelliteCount > 0) || !showSecondButton && overrideView) && (
        <>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
            <View style={styles.svgFSContainer}>
              <ArrowFullScreenOutlineSvg width={60} height={46} style={styles.SvgFSImage} />
            
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
              <ArrowRightCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </View>
        </>
      )}


      {showSecondButton && (
        <>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
            <View style={styles.svgFSContainer}>
              <ArrowFullScreenOutlineSvg width={60} height={46} style={styles.SvgFSImage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
              <ArrowLeftCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </View>
        </>
      )}
      <ActionFriendPageAllImages
      isModalVisible={isFSModalVisible}
      toggleModal={closeModal} onClose={closeModal} />
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
  arrowContainer: {
    flexDirection: 'column',
    marginRight: -4,
  },
  arrowButton: {
    padding: 4,
    marginRight: -8,
    marginLeft: -10,
  },
  svgContainer: {
    width: 60,  
    height: 60,  
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',  
  },
  SvgImage: {
    transform: [{ scale: .8 }],  
  },
  svgFSContainer: {
    width: 60,
    height: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingTop: 20,
    marginBottom: -6,
  },
  SvgFSImage: {
    transform: [{ scale: 1.22 }],
  },
});

export default ActionFriendPageImages;
