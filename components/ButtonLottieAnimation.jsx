import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
const ButtonLottieAnimation = ({
  onPress,
  label,
  height = 134,
  radius = 30,
  preLabel = 'new',
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 18,
  preLabelColor = 'white',
  labelFontSize = 20,
  labelColor = 'black',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  fontMargin = 10,
  animationMargin = 0,
  animationTopMargin = 28,
  showGradient = true,
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
  direction = { x: 1, y: 0 },
  showShape = true,
  shapePosition = 'left',
  shapeSource,
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  shapePositionValueVertical = null,
  labelContainerMarginHorizontal = 0,
  showIcon = true,
  borderWidth = 0, // New prop for inner border width 
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle();
  const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const [ borderColor, setBorderColor ] = useState('transparent');

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
    if (selectedFriend && calculatedThemeColors && !loadingNewFriend) {
      setBorderColor(calculatedThemeColors.lightColor);
    } else {
      setBorderColor('transparent');
    }

  }, [selectedFriend, loadingNewFriend, calculatedThemeColors]);

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
        height: height,
        padding: borderWidth, // Apply padding equal to the border width
        marginBottom: 2,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: showGradient ? 'transparent' : backgroundColor,
        borderWidth: borderWidth, // Set the border width
        borderColor: borderColor, // Set the border color
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
            top: shapePositionValueVertical,
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
                style={{ width: animationWidth, height: animationHeight, marginHorizontal: animationMargin, marginTop: animationTopMargin }}
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
