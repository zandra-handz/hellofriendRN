import React, { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, StyleSheet, Alert } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';

const SlideToAdd = ({ onPress, sliderText='Label', targetIcon: TargetIcon, width = Dimensions.get('window').width - 100 }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const { themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  // Wrap the onPress function to always show an alert first
  const handlePress = () => {
    //Alert.alert("onPress was triggered");
    if (onPress) onPress();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Update the slider position based on user's drag
        if (gestureState.dx >= 0 && gestureState.dx <= width) {
          position.setValue(gestureState.dx);
          
          // Set isDragging to true only when slider is beyond 50% width
          if (gestureState.dx >= width * 0.3) {
            setIsDragging(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If the user slid close to the entire width, trigger the action
        if (gestureState.dx >= width * 0.7) {  // Trigger near the full width
          handlePress();
          setIsPressed(true);
        }
        // Animate the slider back to the start if it wasn't fully slid
        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => setIsDragging(false));  // Reset dragging after animation
      },
    })
  ).current;

  const sliderWidth = width;

  return (
    <View style={[styles.container, { width: sliderWidth, backgroundColor: isDragging ? gradientColors.lightColor : themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]}>
      <Text style={[styles.text, { color: themeAheadOfLoading.fontColorSecondary}]}></Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          { 
            backgroundColor: isDragging ? themeAheadOfLoading.lightColor : themeAheadOfLoading.darkColor,
            transform: [{ translateX: position }],
            width: 'auto', // Adjust the slider thumb width
          },
        ]}
      >
        <Text style={[styles.sliderText, {color: themeAheadOfLoading.fontColor}]}>{sliderText}</Text>
      </Animated.View>
      {TargetIcon && (
        <View style={styles.iconContainer}>
          <TargetIcon height={30} width={30} color={isDragging ? gradientColorsHome.lightColor : themeAheadOfLoading.darkColor} />
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
    borderRadius: 20,
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
    alignText: 'center',
    paddingHorizontal: '3%',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 20,
  },
  sliderText: { 
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    paddingHorizontal: 6,
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

export default SlideToAdd;
