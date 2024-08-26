// Multi feature buttons include options for a Lottie animation (L/R/Center), a background gradient, and a PNG background image (L/R/Center)
// Multi page functionality is a work in progress

import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import UICalendarPageDynamic from '../components/UICalendarPageDynamic';
import ButtonCalendarDateSvgAndLabel from '../components/ButtonCalendarDateSvgAndLabel';

import { Ionicons } from '@expo/vector-icons';

const ButtonMultiFeatureUpcoming = ({
  onPress,
  isLoading = false,
  loadingMessage = 'Welcome back!',
  headerText = 'UP NEXT',
  label,
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
  lightColor = 'black',
  showGradientSatelliteSection = true,
  satelliteDarkColor = 'darkgrey',
  satelliteLightColor = 'darkgrey',
  direction = { x: 1, y: 0 },
  showSatelliteHeader = false,
  showIcon = false,
  showShape = true,
  shapePosition = 'left',
  shapeSource,
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteCount = 2,
  satellitesOrientation = 'horizontal',
  satelliteHeight = 40,
  satelliteHellos = [],
  satelliteOnPress,
  additionalPages = false, // New prop for additional pages
  additionalSatellites = [], // New prop for additional satellites
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle();
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();
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
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    }),
  });

  const extractNumberDate = (dateString) => {
    const match = dateString.match(/\d+/);  
    return match ? match[0] : '';  
  };

  const extractMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);  
    return match ? match[1].slice(0, 3).toUpperCase() : ''; 
  };

  const extractDay = (dateString) => {
    const match = dateString.match(/^\w+/); 
    return match ? match[0].slice(0, 3).toUpperCase() : '';  
};
  
  

  const satelliteWidth = (width / 3) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];

    // Render satellite hellos
    if (satelliteHellos && satelliteHellos.length > 0) {
      const numSatellites = Math.min(satelliteCount, satelliteHellos.length);

      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <TouchableOpacity
            key={i}
            style={[
              styles.satelliteButton,
              { width: 60, alignItems: 'center', height: satellitesOrientation === 'horizontal' ? satelliteHeight : 60 },
            ]}
            onPress={() => satelliteOnPress(satelliteHellos[i])}
          >


          <ButtonCalendarDateSvgAndLabel 
            numberDate={extractNumberDate(satelliteHellos[i].future_date_in_words)}
            month={extractMonth(satelliteHellos[i].future_date_in_words)} 
            width={60} 
            height={60} 
            showMonth={true} 
            showLabel={false}
            onPress={() => satelliteOnPress(satelliteHellos[i])}
            enabled={true}  
            color='white' 
          />
          </TouchableOpacity>
        );
      }
    }

    return satellitesArray;
  };

  const handlePress = () => {
    if (!isLoading) {
      onPress();
    }
  };

  const renderAdditionalSatellites = () => (
    <FlatList
      data={additionalSatellites}
      horizontal
      keyExtractor={(item, index) => `satellite-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.additionalSatelliteButton,
            { width: satelliteWidth },
          
          ]}
          onPress={() => satelliteOnPress(item)}
        >
      
          <ButtonCalendarDateSvgAndLabel 
                numberDate={extractNumberDate(item.future_date_in_words)}
                month={extractMonth(item.future_date_in_words)} 
                label={item.friend_name}
                width={50} 
                height={50} 
                showMonth={false} 
                enabled={true}  
                color='white' 
                onPress={() => satelliteOnPress(item)}
              />
           
        
        </TouchableOpacity>
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
                  height: 140,
                  padding: 10,
                  borderRadius: 30,
                  alignItems: 'center',
                  overflow: 'hidden',
                  backgroundColor: showGradient ? 'transparent' : backgroundColor,
                }}
                onPress={handlePress}
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
                      { fontFamily: 'Poppins-Regular', marginBottom: -6 },
                    ]}
                  >
                    {headerText}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {rightSideAnimation ? (
                      <>
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Light' },
                          ]}
                        >
                          {label}
                        </Text>
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
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Regular' },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {label}
                        </Text>
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
              <View style={[styles.satelliteSection, { backgroundColor: backgroundColor, paddingTop: 0, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                    {showSatelliteHeader && (
                    <Text
                        style={[
                        textStyles(preLabelFontSize, preLabelColor),
                        { fontFamily: 'Poppins-Regular', marginBottom: -6 , zIndex: 1},
                        ]}
                    >
                       SOON
                  </Text>
                  )}
                {showGradientSatelliteSection && (
                  <LinearGradient
                    colors={[satelliteDarkColor,satelliteLightColor]}
                    start={{ x: 0, y: 0 }}
                    end={direction}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
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
  container: {
    width: '100%',
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
  },
  mainButtonContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  },
  satelliteSection: {
    width: '33.33%',
    height: 140,
    borderRadius: 0,
    marginLeft: -20,
    paddingLeft: 0,  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  satelliteButton: { 
    alignItems: 'center',  
    alignContents: 'center', 
    justifyContent: 'space-around',  
  },
  additionalSatelliteSection: {
    flexDirection: 'row',
    height: 140,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  additionalSatelliteButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center', 
    borderRadius: 0, 
    borderRightWidth: .8,
    borderColor: 'darkgray', 
    paddingTop: 30,
    height: '100%',
    width: 50,
    backgroundColor: 'transparent',

    
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: 'white',
    
  },
});

export default ButtonMultiFeatureUpcoming;
