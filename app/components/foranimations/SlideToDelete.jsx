import React, { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 import DragRightThickOutlineSvg from '@/app/assets/svgs/drag-right-thick-outline.svg';

 const SlideToDelete = ({ onPress, buttonBackgroundColor='white', sliderText = 'Label', targetIcon: TargetIcon, width = Dimensions.get('window').width - 50, disabled=false }) => {
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

          if (gestureState.dx >= width * 0.2 && !isDraggingRef.current) {
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
            : 'transparent' //themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            flexDirection: 'row', 
            backgroundColor: isDragging ? '#000002' : buttonBackgroundColor,
            transform: [{ translateX: position }],
            width: 'auto',
          },
        ]}
      >        
        <Text style={[styles.sliderText, themeStyles.genericText]}>{sliderText}</Text>

        <View style={{paddingHorizontal: '2%' }}>
      <DragRightThickOutlineSvg height={18} width={18} style={themeStyles.genericText} />
      </View>
      </Animated.View>
      {TargetIcon && (
        <View style={styles.iconContainer}>
          <TargetIcon height={30} width={30} color={isDragging ? themeStyles.genericText.color : 'transparent'} />
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
    borderRadius: 30,
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
    borderColor: 'transparent',
  },
  sliderText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SlideToDelete;
