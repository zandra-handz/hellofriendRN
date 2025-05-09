import { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 

const SlideToAction = ({ onPress, sliderText = 'DELETE', sliderColor = 'red', targetIcon: TargetIcon, width = Dimensions.get('window').width }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false); // Use ref for immediate updates
  const { themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();
 

  const handlePress = () => { 
    if (onPress) onPress();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= width) {
          position.setValue(gestureState.dx);

          if (gestureState.dx >= width * 0.1 && !isDraggingRef.current) {
            isDraggingRef.current = true; // Update ref immediately
            setIsDragging(true); // Update state for UI
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= width * 0.7) {
          handlePress();
          setIsPressed(true);
        }

        isDraggingRef.current = false; // Reset ref immediately
        setIsDragging(false); // Reset state for UI

        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
          speed: 15, // Faster spring animation
          bounciness: 8, // Lower bounciness for quicker reset
        }).start();
      },
    })
  ).current;

  const sliderWidth = width;

  return (
    <View
      style={[
        styles.container,
        {
          width: sliderWidth,
          backgroundColor: isDragging
            ? 'red'
            : themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: themeStyles.genericText }]}></Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            backgroundColor: isDragging ? gradientColorsHome.darkColor : 'transparent',
            transform: [{ translateX: position }],
            width: 'auto',
          },
        ]}
      >
        <Text style={[styles.sliderText, themeStyles.genericText]}>{sliderText}</Text>
      </Animated.View>
      {TargetIcon && (
        <View style={styles.iconContainer}>
          <TargetIcon height={30} width={30} color={isDragging ? gradientColorsHome.lightColor : 'transparent'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    margin: 0,
  },
  text: {
    position: 'absolute',
    color: '#333',
    fontSize: 16,
  },
  slider: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '3%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: 'darkgray',
  },
  sliderText: {
    fontSize: 12,
  },
  completedText: {
    position: 'absolute',
    bottom: -30,
    fontSize: 14,
    color: 'green',
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SlideToAction;
