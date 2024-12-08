import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import RightArrowNoStemSolidSvg from '../assets/svgs/right-arrow-no-stem-solid.svg';


const DOUBLE_TAP_DELAY = 300;  

const SlideUpToOpen = ({
  onPress, 
  onDoubleTap=() => {},
  targetIcon: TargetIcon,
  height = 200,  
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false);

  const screenHeight = Dimensions.get('window').height; // Full screen height
  const { manualGradientColors, themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();
const [ helpersVisible, setHelpersVisible ] = useState(false);
const lastTapRef = useRef(0); 


const rotation = position.interpolate({
    inputRange: [-screenHeight / 20, 0], 
    outputRange: ['-90deg', '0deg'],
    extrapolate: 'clamp',
  });

  const handlePress = () => {
    if (onPress) onPress();
  };

  const handleDoubleTap = () => {
    if (onDoubleTap) onDoubleTap();
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      console.log('double tapped!');
      handleDoubleTap();
    } else {
      lastTapRef.current = now;
    }
  };

  const onInitialPress = () => {
    setHelpersVisible(true);
    console.log('slide up button pressed');

  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Trigger the initial press action
        handleTap();
        if (onInitialPress) {
          onInitialPress();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy <= 0 && Math.abs(gestureState.dy) <= screenHeight) {
          position.setValue(gestureState.dy);

          if (Math.abs(gestureState.dy) >= screenHeight * 0.09 ) { //&& !isDraggingRef.current
            setHelpersVisible(false);
            
          } 

          if (Math.abs(gestureState.dy) >= screenHeight * 0.08 ) { //&& !isDraggingRef.current
            isDraggingRef.current = true;
            setIsDragging(true); 
            
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) >= screenHeight * 0.1) {
          console.log('press in slider up');
          
          handlePress();
          setIsPressed(true);
        }

        // Triggering the correct animation based on isPressed state
        if (!isPressed) {
          setHelpersVisible(false);
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
      // If pressed, immediately move to the top
      Animated.spring(position, {
        toValue: -screenHeight * .88,  // Move to the top of the screen
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
            borderRadius: '50%',
          }}
        >

          <RightArrowNoStemSolidSvg
            height={40}
            width={40}
            color={manualGradientColors.lightColor}
          />
        </View>
      </Animated.View>
      {helpersVisible && ( 
            
            <View style={{position: 'absolute', height: 40, width: 40, borderRadius: 20, top: 70, backgroundColor: 'red'}}>
  
  
            </View>
            )}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 50,
    zIndex: 5000,
    elevation: 5000,
  },
  slider: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 50,
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

export default SlideUpToOpen;
