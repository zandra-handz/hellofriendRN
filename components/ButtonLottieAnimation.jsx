import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import the global style context

const ButtonLottieAnimation = ({
  onPress,
  label,
  preLabel = 'new', // Default pre-label text
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 18, // Font size for pre-label
  preLabelColor = 'white', // Color for pre-label text
  labelFontSize = 20,
  labelColor = 'black',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  fontMargin = 10,
  animationMargin = 0,
  showGradient = true,
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
  direction = { x: 1, y: 0 },
  showShape = true,
  shapePosition = 'left',
  shapeSource = require('../assets/shapes/greenleaf.png'), // Default shape
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134, // Default value
  labelContainerMarginHorizontal = 0, // Default margin for label container
  showIcon = true, // New property to show/hide Lottie icon
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle(); // Get the global styles

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

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: '100%',
        height: 140,
        padding: 10,
        marginBottom: 2,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden', // Ensure the gradient and shape stay within rounded borders
        backgroundColor: showGradient ? 'transparent' : backgroundColor,
      }}
      onPress={onPress}
    >
      {showGradient && (
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={direction}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
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
      <View style={{ flexDirection: 'row', marginHorizontal: labelContainerMarginHorizontal, alignItems: 'center' }}>
        {rightSideAnimation ? (
          <>
            <Text
              style={[
                textStyles(preLabelFontSize, preLabelColor),
                { fontFamily: 'Pacifico-Regular', marginRight: fontMargin },
              ]}
            >
              {preLabel}
            </Text>
            <Text
              style={[
                textStyles(labelFontSize, labelColor),
                { fontFamily: 'Poppins-Light', marginRight: fontMargin },
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
                textStyles(preLabelFontSize, preLabelColor),
                { fontFamily: 'Pacifico-Regular', marginRight: fontMargin, marginBottom: 15 },
              ]}
            >
              {preLabel}
            </Text>
            <Text
              style={[
                textStyles(labelFontSize, labelColor),
                { fontFamily: 'Poppins-Regular', marginRight: fontMargin },
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ButtonLottieAnimation;
