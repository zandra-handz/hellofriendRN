// ButtonLottieAnimationSatellites.js

import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonLottieAnimationSatellites = ({
  onPress,
  headerText = 'Up next:',
  label,
  additionalText = 'N/A',
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 18,
  preLabelColor = 'white',
  labelFontSize = 20,
  labelColor = 'black',
  additionalTextFontSize = 16,
  additionalTextColor = 'gray',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  fontMargin = 10,
  animationMargin = 0,
  showGradient = true,
  darkColor = '#C0C0C0',
  lightColor = '#D3D3D3',
  direction = { x: 1, y: 0 },
  showShape = true,
  shapePosition = 'left',
  shapeSource = require('../assets/shapes/greenleaf.png'),
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  labelContainerMarginHorizontal = 0,
  showIcon = true,
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteCount = 3,
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle();
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [animationSource]);

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

  const satelliteWidth = (width / 4) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];
    for (let i = 0; i < satelliteCount; i++) {
      satellitesArray.push(
        <TouchableOpacity key={i} style={[styles.satelliteButton, { width: satelliteWidth, height: satelliteWidth }]}>
          <Text style={styles.satelliteText}>{i + 1}</Text>
        </TouchableOpacity>
      );
    }
    return satellitesArray;
  };

  const handlePress = () => {
    // Navigate to FriendFocusScreen with animation
    navigation.navigate('FriendFocus');
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.mainButtonContainer, { width: satellites ? '66.66%' : '100%' }]}>
          <TouchableOpacity
            style={{
              flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
              width: '100%',
              height: 126,
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
            <Text
              style={[
                textStyles(preLabelFontSize, preLabelColor),
                { fontFamily: 'Pacifico-Regular', marginBottom: fontMargin, position: 'absolute', top: 5 },
              ]}
            >
              {headerText}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {rightSideAnimation ? (
                <>
                  <Text
                    style={[
                      textStyles(labelFontSize, labelColor),
                      { fontFamily: 'Poppins-Light', marginLeft: 10 },
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
                      { fontFamily: 'Poppins-Regular', marginRight: 10 },
                    ]}
                  >
                    {label}
                  </Text>
                </>
              )}
            </View>
            <Text
              style={[
                textStyles(additionalTextFontSize, additionalTextColor),
                { marginTop: 5, textAlign: 'center', paddingHorizontal: 20 }, // Ensure text wraps and takes full width
              ]}
            >
              {additionalText}
            </Text>
          </TouchableOpacity>
        </View>
        {satellites && (
          <View style={styles.satelliteSection}>
            {renderSatellites()}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 30,
    overflow: 'hidden',
  },
  mainButtonContainer: {
    overflow: 'hidden',
  },
  satelliteSection: {
    width: '33.33%',
    height: 126,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  satelliteButton: {
    backgroundColor: '#4caf50',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  satelliteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ButtonLottieAnimationSatellites;
