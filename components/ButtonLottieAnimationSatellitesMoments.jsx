import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemMomentSingle from '../components/ItemMomentSingle';
import ItemMomentMulti from '../components/ItemMomentMulti'; // Import the ItemImageSingle component
import { useCapsuleList } from '../context/CapsuleListContext';

const ButtonLottieAnimationSatellitesMoments = ({
  onPress,
  buttonHeight = 270,
  buttonRadius = 10,
  isLoading = false,
  loadingMessage = '',
  headerText = 'LAST ADDED',
  firstItem,
  allItems,
  categoryAttribute = 'typedCategory',
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
  satelliteMoments = [],  
  additionalPages = false,
  additionalPagesCategorize = true,
  additionalSatellites = [], 
}) => {
  const lottieViewRef = useRef(null);
  const [category, setCategory] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width } = Dimensions.get('window');
  const [mainViewVisible, setMainViewVisible] = useState(true);
  const { capsuleList } = useCapsuleList();
  const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.typedCategory);
    }
  }, []);

  useEffect(() => {
    if (capsuleList.length > 0) {
      setIsCapsuleListReady(true);
    }
  }, [capsuleList]);

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      lottieViewRef.current.play();
    }
  }, [animationSource]);

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
    if (!satellites || satelliteMoments.length === 0) {
      return null;
    }

    const numSatellites = Math.min(satelliteCount, satelliteMoments.length);
    const satellitesArray = [];

    for (let i = 0; i < numSatellites; i++) {
      satellitesArray.push(
        <ItemMomentSingle key={`satellite-${i}`} momentObject={null} momentWidth={174} momentHeight={174} />
      );
    }

    return satellitesArray;
  };

  const renderAdditionalSatellites = useCallback(() => {
    return (
      <FlatList
        data={allItems}
        horizontal
        keyExtractor={(item, index) => `additional-satellite-${index}`}
        renderItem={({ item }) => (
          <> 
          <View style={{paddingRight: 10 }}>
          <ItemMomentSingle momentObject={item} momentWidth={240} momentHeight={240}/>
          </View>
          </>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        ListFooterComponent={<View style={{ width: 76 }} />}
      />
    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
      {!additionalPages && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { height: buttonHeight,   width: satellites ? '100%' : '100%' }]}>
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '100%',
                  height: buttonHeight, 
                  borderRadius: buttonRadius,
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
                <View style={[styles.mainSection, {height: buttonHeight, width: '100%', borderRadius: buttonRadius }]}>
          
                <Text style={styles.categoryText}>{headerText}</Text>
          
                  <View style={{ flexDirection: 'row' }}>
                    {rightSideAnimation ? (
                      <>
                        <ItemMomentSingle momentObject={firstItem} momentWidth={174} momentHeight={174}/> 
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
                        {isCapsuleListReady && (
                          <ItemMomentMulti width={240} height={240} limit={3} viewSortedList={false} horizontal={true} singleLineScroll={true} newestFirst={true}/> 
                        )}
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
              <View style={[styles.satelliteSection, { height: buttonHeight, borderRadius: buttonRadius, lexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {height: buttonHeight, borderRadius: buttonRadius }]}>
          
          {additionalPagesCategorize && (
            <Text style={styles.categoryText}>Category: {category}</Text>
          
          )}
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
    height: 0,
    width: 0,   
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

export default ButtonLottieAnimationSatellitesMoments;
