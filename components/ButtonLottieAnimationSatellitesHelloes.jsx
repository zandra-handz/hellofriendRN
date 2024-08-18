import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import useCapsuleList from '../context/CapsuleListContext';
import { LinearGradient } from 'expo-linear-gradient';
import ItemHelloSingle from '../components/ItemHelloSingle';
import ItemHelloMulti from '../components/ItemHelloMulti'; // Import the ItemImageSingle component
import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import CoffeeCupPaperSolid from '../assets/svgs/coffee-cup-paper-solid';

import IconDynamicHelloType from '../components/IconDynamicHelloType';

const ButtonLottieAnimationSatellitesHelloes = ({
  onPress,
  buttonHeight = 60,
  buttonRadius = 10,
  isLoading = false,
  loadingMessage = '',
  headerText = 'LAST HELLO',
  firstItem,
  firstItemDetailsAsSatellites = true,
  allItems,
  categoryAttribute = 'typedCategory',
  subHeaderText = '',
  additionalText = '',
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 18,
  preLabelColor = 'white',
  labelFontSize = 22,
  labelColor = 'black',
  additionalTextFontSize = 16,
  additionalTextColor = 'white',
  typeIcon = null,
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
  satelliteSectionPosition = 'left',
  satelliteSectionBackgroundColor = 'black',
  satelliteCount = 3,
  satellitesOrientation = 'horizontal',
  satelliteHeight = 60,
  satelliteHelloes = [],  
  additionalPages = false,
  additionalPagesCategorize = true,
  additionalSatellites = [], 
}) => {
  const lottieViewRef = useRef(null);
  const [category, setCategory] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width } = Dimensions.get('window');
  const [mainViewVisible, setMainViewVisible] = useState(true);
  
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;

      setCategory(topItem.date); // Correct usage
      console.log('Top item:', topItem);
      console.log('Category:', topItem); // Correct usage
    }
  }).current;

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      lottieViewRef.current.play();
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
    return fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
  });

  const satelliteWidth = (width / 4) / satelliteCount;

  const renderSatellites = () => {
    if (!firstItemDetailsAsSatellites) {
      if (!satellites || satelliteHelloes.length === 0) {
        return null;
      }
  
      const numSatellites = Math.min(satelliteCount, satelliteHelloes.length);
      const satellitesArray = [];
  
      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <ItemHelloSingle key={`satellite-${i}`} helloObject={satelliteHelloes[i]} helloWidth={20} helloHeight={20}/>
       
        );
      }
  
      return satellitesArray;
    }
  
    if (firstItemDetailsAsSatellites) {
      return typeIcon;
    }
  };
  

  const renderAdditionalSatellites = useCallback(() => {
    return (
      <FlatList
        data={allItems}
        horizontal
        keyExtractor={(item, index) => `additional-satellite-${index}`}
        renderItem={({ item }) => (
          <ItemHelloSingle helloObject={item}  />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        ListFooterComponent={<View style={{ width: 283 }} />} 
      />
    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
      {!additionalPages && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { height: buttonHeight, width: satellites ? '100%' : '100%' }]}>
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '76%',
                  height: buttonHeight,
                  padding: 10,
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
                <View style={{ flexDirection: 'column', paddingHorizontal: 5, paddingBottom: 8, paddingTop: 8, flex: 1 }}>

                  <View style={{ flexDirection: 'row' }}>
                    {rightSideAnimation ? (
                      <>
                        <ItemHelloSingle helloObject={firstItem}   /> 
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
                        <ItemHelloMulti helloData={allItems} width={120} height={120} limit={0} /> 
                      </>
                    )}
                  </View>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginVertical: 4, marginBottom: 2 },
                    ]}
                  >
                    {additionalText} 
                  </Text>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginVertical: 4 },
                    ]}
                  >  
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {satellites && (
              <View style={[styles.satelliteSection, { height:buttonHeight, borderRadius: buttonRadius, backgroundColor: satelliteSectionBackgroundColor, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                
                
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {height:buttonHeight, borderRadius: buttonRadius }]}>
          {additionalPagesCategorize && (
            <Text style={styles.categoryText}>{category}</Text>
          )}
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};
  
const styles = StyleSheet.create({ 
  satelliteSection: {
    width: '24%',  
    marginLeft: -70,
    paddingLeft: 0, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'black',
  
    // iOS shadow properties
    shadowColor: '#000', // Dark shadow color
    shadowOffset: { width: 0, height: 6 }, // More vertical offset
    shadowOpacity: 0.5, // Increased opacity for a darker shadow
    shadowRadius: 12, // Larger radius for a more defined shadow
  
    // Android shadow properties
    elevation: 8, // Higher elevation for a more pronounced shadow
  },
  
  additionalSatelliteSection: {
    flexDirection: 'column',
    marginVertical: 0, 
    backgroundColor: 'black',
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

export default ButtonLottieAnimationSatellitesHelloes;
