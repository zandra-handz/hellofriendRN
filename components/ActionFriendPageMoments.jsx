import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Animated, TouchableOpacity } from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';
import ActionFriendPageAllMoments from '../components/ActionFriendPageAllMoments';
 
const ActionFriendPageMoments = () => {
  const { capsuleList } = useCapsuleList();
  const [isFSModalVisible, setIsFSModalVisible] = useState(false);
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const mainMoment = capsuleList.length > 0 ? capsuleList[0] : null;
  const satelliteMoments = capsuleList.length > 1 ? capsuleList.slice(1) : [];
  const additionalSatelliteCount = satelliteMoments.length - 1;

  let satellitesFirstPage = 1;

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

  const handlePress = (moment) => {
    // Handle moment press actions
    console.log('Selected Moment:', moment);
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
 
      <ActionFriendPageAllMoments
      isModalVisible={isFSModalVisible}
      toggleModal={closeModal} onClose={closeModal} />
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
  arrowContainer: {
    flexDirection: 'column',
    marginRight: -4,

  },
  arrowButton: {
    padding: 4,
    marginRight: -8,
    marginLeft: -10,
  },
  animatedView: {
    flex: 1,
  },
  svgContainer: {
    width: 60,
    height: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SvgImage: {
    transform: [{ scale: 0.8 }],
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActionFriendPageMoments;
