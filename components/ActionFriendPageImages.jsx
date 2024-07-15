import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Button, Image } from 'react-native';
import ButtonLottieAnimationSatellitesImages from './ButtonLottieAnimationSatellitesImages';
import { useImageList } from '../context/ImageListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';


const ActionFriendPageImages = ({ onPress }) => { 
  
  const { selectedFriend } = useSelectedFriend();
  const { imageList, setImageList } = useImageList();

  let mainImage = null;
  let satelliteImages = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalImages = [];

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





  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);



  return (
    <View style={styles.container}> 
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
           
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
});

export default ActionFriendPageImages;
