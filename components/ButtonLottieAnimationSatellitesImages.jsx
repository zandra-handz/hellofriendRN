import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemImageSingle from '../components/ItemImageSingle'; // Import the ItemImageSingle component
import ItemImageMulti from '../components/ItemImageMulti'; // Import the ItemImageSingle component



const ButtonLottieAnimationSatellitesImages = ({
  onPress,
  isLoading = false,
  loadingMessage = 'Loading...',
  headerText = 'UP NEXT',
  
  firstItem,
  allItems,
  additionalText = 'N/A',
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
    if (isLoading) {
      animateLoadingIndicator();
    } else {
      // Reset animation to full opacity
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
    // Modify this function if needed
    return fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
  });

  const satelliteWidth = (width / 4) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];

    // Render satellite images
    if (satelliteImages && satelliteImages.length > 0) {
      console.log('satelliteImages: ', satelliteImages);
      const numSatellites = Math.min(satelliteCount, satelliteImages.length);

      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <ItemImageSingle imageData={satelliteImages[i]} /> 
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
          
          <ItemImageSingle imageObject={item} />
        )}
      />
    );

  return (
    <View style={styles.container}>
      {!additionalPages && mainViewVisible && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { width: satellites ? '76.66%' : '100%' }]}>
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '100%',
                  height: 146,
                  padding: 10,
                  borderRadius: 30,
                  alignItems: 'center',
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
                <View style={{ flexDirection: 'column', paddingHorizontal: 5, paddingBottom: 8, paddingTop: 8, flex: 1 }}>
                  <Text
                    style={[
                      textStyles(preLabelFontSize, preLabelColor),
                    ]}
                  >
                    {headerText}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {rightSideAnimation ? (
                      <>
                        <ItemImageSingle imageObject={firstItem} /> 
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
                        <ItemImageMulti imageData={allItems} /> 
                      </>
                    )}
                  </View>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginBottom: 10 },
                    ]}
                  >
                    {additionalText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {satellites && (
              <View style={[styles.satelliteSection, { flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={styles.additionalSatelliteSection}>
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  // Existing styles continue here...
  satelliteSection: {
    width: '33.33%',
    height: 126,
    borderRadius: 20,
    marginLeft: -20,
    paddingLeft: 8,
    marginTop: '4%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'darkgrey', 
  },
  satelliteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  satelliteImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  satelliteText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  additionalSatelliteSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    height: 166,
    borderRadius: 30, 
    backgroundColor: 'black',
  },
  additionalSatelliteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
});

export default ButtonLottieAnimationSatellitesImages;
