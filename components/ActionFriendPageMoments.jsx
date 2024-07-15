import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';



const ActionFriendPageMoments = ({ onPress }) => {
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();


  
  let mainMoment = null;
  let satelliteMoments = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null; 

  if (capsuleList.length > 0) {
    mainMoment = capsuleList[0];
    satelliteMoments = capsuleList.slice(1);
    additionalSatelliteCount = satelliteMoments.length - satellitesFirstPage;

 
  }

  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

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
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  
  const handlePress = (moment) => {
    const { capsule, typedCategory } = moment;   
    console.log('ALL!!', capsule);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonLottieAnimationSatellitesMoments
            onPress={() => handlePress(mainMoment)} 
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainMoment ? mainMoment.capsule : 'Loading...'}
            allItems={capsuleList ? capsuleList : 'Loading...'}
            additionalText={mainMoment ? mainMoment.typed_category : ''}
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
            satelliteMoments={satelliteMoments}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={showSecondButton}
            additionalSatellites={capsuleList}
            satelliteOnPress={(moment) => handlePress(moment)} 
          />
        ) : (
          <ButtonLottieAnimationSatellitesMoments
            onPress={() => handlePress(mainMoment)}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainMoment ? mainMoment.capsule : 'Loading...'}
            allItems={capsuleList ? capsuleList : 'Loading...'}
            
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
            satelliteMoments={satelliteMoments}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(moment) => handlePress(moment)} 
          />
        )}
      </Animated.View>

      {!showSecondButton && additionalSatelliteCount > 0 && (
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <View style={styles.svgContainer}>
            <ArrowRightCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
          </View>
        </TouchableOpacity>
      )}

      {showSecondButton && (
        <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
          <View style={styles.svgContainer}>
            <ArrowLeftCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ActionFriendPageMoments;
