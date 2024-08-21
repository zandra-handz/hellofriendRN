import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemLocationSingle from '../components/ItemLocationSingle';
import ItemLocationFaves from '../components/ItemLocationFaves'; 
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';



const ButtonLottieAnimationSatellitesLocations = ({
  onPress,
  buttonHeight = 90,
  buttonRadius = 10,
  isLoading = false,
  loadingMessage = '',
  headerText = 'PINNED',
  headerSvg = null,
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
  satelliteLocations = [],  
  additionalPages = false,
  additionalPagesCategorize = true,
  additionalSatellites = [], 
}) => {
  const lottieViewRef = useRef(null);
  const [category, setCategory] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width } = Dimensions.get('window');
  const [mainViewVisible, setMainViewVisible] = useState(true);
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { locationList } = useLocationList();

  const [faveLocationList, setFaveLocationList] = useState([]);


  useEffect(() => {
      if (friendDashboardData && friendDashboardData.length > 0) {
          const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations?.map(location => location.id) || [];
          const favoriteLocations = locationList.filter(location => favoriteLocationIds.includes(location.id));
          setFaveLocationList(favoriteLocations);
          
      }
  }, [locationList, friendDashboardData]);

  useEffect(() => {
      console.log('Total number of favorite locations:', faveLocationList.length);
  }, [faveLocationList.length]);
  

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;

      setCategory(topItem.title); // Correct usage
      console.log('Top item:', topItem);
      console.log('Category:', topItem.title); // Correct usage
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
    if (!satellites || satelliteLocations.length === 0) {
      return null;
    }

    const numSatellites = Math.min(satelliteCount, satelliteLocations.length);
    const satellitesArray = [];

    for (let i = 0; i < numSatellites; i++) {
      satellitesArray.push(
        <ItemLocationSingle key={`satellite-${i}`} locationObject={null}  />
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
        <ItemLocationSingle locationObject={item} locationWidth={20} locationHeight={20} spacer={30} />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      ListFooterComponent={<View style={{ width: 283 }} />} // Add blank space at the end of the list
    
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
                  width: '100%',
                  height: buttonHeight,
                  padding: 10,
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
                <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingBottom: 0, paddingTop: 6, flex: 1 }}>
                
                <View style={styles.svgContainer}>
                    {headerSvg} 
                </View>
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
                        <ItemLocationSingle locationObject={firstItem}  /> 
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
                        <View style={{flex: 1}}> 
                          <ItemLocationFaves locationData={faveLocationList}  containerWidth={254} width={26} height={26} newestFirst={true}/> 
                        </View>
                      </>
                    )}
                  </View>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginBottom: 10 },
                    ]}
                  > 
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {satellites && (
              <View style={[styles.satelliteSection, { borderRadius : buttonRadius, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {borderRadius: buttonRadius, height: buttonHeight}]}>
          {additionalPagesCategorize && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};
  
const styles = StyleSheet.create({ 
svgContainer: {
    marginRight: 40,
},
  satelliteSection: {
    width: '0%',
    height: 0,
    paddingLeft: 8, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  additionalSatelliteSection: {
    flexDirection: 'column',
    marginVertical: 0, 
    backgroundColor: 'black',
  },
  categoryTextContainer: { 
    width: 300,  
    marginLeft: 10, 
    height: 46,
    marginBottom: 0,
    justifyContent: 'center',
    whiteSpace: 'nowrap', 
  },

  categoryText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Bold', 
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 20,
    whiteSpace: 'nowrap', // This property may not be supported in React Native, so adjust using maxWidth or width
    textOverflow: 'ellipsis', // This property may not be supported in React Native, so adjust using maxWidth or width
  
  },
});

export default ButtonLottieAnimationSatellitesLocations;
