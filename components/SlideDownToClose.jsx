import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import RightArrowNoStemSolidSvg from '../assets/svgs/right-arrow-no-stem-solid.svg';

const SlideDownToClose = ({
  onPress, 
  targetIcon: TargetIcon,
  height = 200,   
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false);

  const screenHeight = Dimensions.get('window').height; // Full screen height
  const { manualGradientColors, themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();

  const rotation = position.interpolate({
    inputRange: [0, screenHeight / 20], // Use screenHeight here
    outputRange: ['0deg', '90deg'],
    extrapolate: 'clamp',
  });

  const handlePress = () => {
    if (onPress) onPress();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy >= 0 && Math.abs(gestureState.dy) <= screenHeight) {
          position.setValue(gestureState.dy);

          if (Math.abs(gestureState.dy) >= screenHeight * 0.08) { //&& !isDraggingRef.current
            isDraggingRef.current = true;
            setIsDragging(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) >= screenHeight * 0.1) {
          console.log('press in slider down');
          handlePress();
          setIsPressed(true);
        }

        // Triggering the correct animation based on isPressed state
        if (!isPressed) {
          // Only bounce back if NOT pressed
          isDraggingRef.current = false;
          setIsDragging(false);
          Animated.spring(position, {
            toValue: 0,  // Move back to the original position
            useNativeDriver: true,
            speed: 15,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  // UseEffect to handle animation when the slider is pressed
  useEffect(() => {
    if (isPressed) {
      // If pressed, immediately move to the bottom
      Animated.spring(position, {
        toValue: screenHeight * 0.88,  // Move to the bottom of the screen
        useNativeDriver: true,
        speed: 15,
        bounciness: 8,
      }).start();
    }
  }, [isPressed]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: isDragging
            ? gradientColors.lightColor
            : 'transparent',
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            backgroundColor: isDragging
              ? '#000002'
              : themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
            transform: [
              { translateY: position },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <View
          style={{
            backgroundColor: manualGradientColors.homeDarkColor,
            alignItems: 'center',
            justifyContent: 'center',
            width: 73,
            height: 73,
            borderRadius: 50,
          }}
        >
          <RightArrowNoStemSolidSvg
            height={40}
            width={40}
            color={manualGradientColors.lightColor}
          />
        </View>
      </Animated.View>
      {TargetIcon && (
        <View style={styles.iconContainer}>
          <TargetIcon
            height={30}
            width={30}
            color={isDragging ? gradientColorsHome.lightColor : 'transparent'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 30,
    zIndex: 5000,
    elevation: 5000,
  },
  slider: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'transparent',
    zIndex: 5000,
    elevation: 5000,
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5000,
    elevation: 5000,
  },
});

export default SlideDownToClose;
