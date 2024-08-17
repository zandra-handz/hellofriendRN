import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemImageSingle from '../components/ItemImageSingle'; // Import the ItemImageSingle component
import ItemImageMulti from '../components/ItemImageMulti'; // Import the ItemImageSingle component
import { useImageList } from '../context/ImageListContext';


const ButtonLottieAnimationSatellitesImages = ({
  onPress,
  buttonHeight = 136,
  buttonRadius = 10,
  isLoading = false,
  loadingMessage = '',
  headerText = 'LAST ADDED',
  
  firstItem,
  allItems,
  additionalText = '',
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 18,
  preLabelColor = 'white',
  labelFontSize = 22,
  labelColor = 'black',
  additionalTextFontSize = 16,
  additionalTextColor = 'white',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },
  showIcon = false,
  showShape = true,
  shapePosition = 'left',
  shapeSource = require('../assets/shapes/greenleaf.png'),
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteCount = 3,
  satellitesOrientation = 'horizontal',
  satelliteHeight = 40,
  satelliteImages = [], // New prop for satellite images
  satelliteOnPress,
  additionalPages = false,
  additionalSatellites = [], // New prop for additional satellites
}) => {
  const lottieViewRef = useRef(null);
  const { width } = Dimensions.get('window');
  const [showEmptyContainer, setShowEmptyContainer] = useState(false);
  const [mainViewVisible, setMainViewVisible] = useState(true);
  const { imageList } = useImageList();
  const [isImageListReady, setIsImageListReady] = useState(false);

  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [animationSource]);

  useEffect(() => {
    if (imageList.length > 0) {
      setIsImageListReady(true);
    }
  }, [imageList]);

  useEffect(() => {
    if (isLoading) {
      animateLoadingIndicator();
    } else { 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const animateLoadingIndicator = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const getShapeStyle = () => {
    switch (shapePosition) {
      case 'left':
        return { left: shapePositionValue };
      case 'center':
        return { left: '33.33%' };
      case 'right':
        return { right: shapePositionValue };
      default:
        return { left: 0 };
    }
  };

  const adjustFontSize = (fontSize) => { 
    return fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
  });

  const satelliteWidth = (width / 4) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];
 
    if (satelliteImages && satelliteImages.length > 0) {
      console.log('satelliteImages: ', satelliteImages);
      const numSatellites = Math.min(satelliteCount, satelliteImages.length);

      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <ItemImageSingle imageData={satelliteImages[i]} width={70} height={70} /> 
        );
      }
    }

    return satellitesArray;
  };

  const renderAdditionalSatellites = () => (

        <FlatList
        data={additionalSatellites}
        horizontal
        keyExtractor={(item, index) => `satellite-${index}`}
        renderItem={({ item }) => (
          
          <ItemImageSingle imageObject={item} height={80} width={80} />
        )}
      />
    );

  return (
    <View style={styles.container}>
      {!additionalPages && mainViewVisible && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { height: buttonHeight, borderRadius: buttonRadius, width: satellites ? '100%' : '100%' }]}>
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '100%',
                  height: buttonHeight,
                  padding: 6,
                  borderRadius: buttonRadius, 
                  overflow: 'hidden',
                  backgroundColor: showGradient ? 'transparent' : backgroundColor,
                }}
                onPress={onPress}
              >
                {showGradient && (
                  <LinearGradient
                    colors={[darkColor, lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={direction}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                {showShape && (
                  <Image
                    source={shapeSource}
                    style={{
                      position: 'absolute',
                      width: shapeWidth,
                      height: shapeHeight,
                      ...getShapeStyle(),
                    }}
                    resizeMode="contain"
                  />
                )}
              <View style={[styles.mainSection, {height: buttonHeight, width: '100%', borderRadius: buttonRadius }]}>
          
                  <View style={{ flexDirection: 'row' }}>
                    {rightSideAnimation ? (
                      <>
                        <ItemImageSingle imageObject={firstItem} height={80} width={80} /> 
                        {showIcon && animationSource && (
                          <LottieView
                            ref={lottieViewRef}
                            source={animationSource}
                            loop
                            autoPlay
                            style={{ width: animationWidth, height: animationHeight, marginHorizontal: animationMargin }}
                            onError={(error) => console.error('Error rendering animation:', error)}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {showIcon && animationSource && (
                          <LottieView
                            ref={lottieViewRef}
                            source={animationSource}
                            loop
                            autoPlay
                            style={{ width: animationWidth, height: animationHeight, marginHorizontal: animationMargin }}
                            onError={(error) => console.error('Error rendering animation:', error)}
                          />
                        )} 
                        {isImageListReady && (
                          <ItemImageMulti imageData={allItems} width={40} height={40} borderRadius={buttonRadius} /> 
                        )}
                        </>
                    )}
                  </View>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginBottom: 0 },
                    ]}
                  > 
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {satellites && (
              <View style={[styles.satelliteSection, { height: buttonHeight, borderRadius: buttonRadius, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {height: buttonHeight, borderRadius: buttonRadius }]}>
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({ 
  mainSection: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 10,   
  },
  satelliteSection: {
    width: '23.33%', 
    width: 0,
    height: 0,  
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white', 
  },  
  additionalSatelliteSection: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 13.5,  
    backgroundColor: 'black',
    overflow: 'hidden',
  }, 
  categoryText: {
    fontSize: 14, 
    color: 'white',
    fontFamily: 'Poppins-Bold', 
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 20,
    whiteSpace: 'nowrap', // This property may not be supported in React Native, so adjust using maxWidth or width
    textOverflow: 'ellipsis',
  },
});

export default ButtonLottieAnimationSatellitesImages;
