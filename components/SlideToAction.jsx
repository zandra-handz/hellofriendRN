import React, { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, StyleSheet, Alert } from 'react-native';

const SlideToAction = ({ onPress, targetIcon: TargetIcon, width = Dimensions.get('window').width }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;

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
          if (gestureState.dx >= width * 0.8) {
            setIsDragging(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If the user slid close to the entire width, trigger the action
        if (gestureState.dx >= width * 0.8) {  // Trigger near the full width
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
    <View style={[styles.container, { width: sliderWidth, backgroundColor: isDragging ? 'red' : 'white' }]}>
      <Text style={styles.text}></Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          { 
            backgroundColor: isDragging ? 'darkred' : 'red',
            transform: [{ translateX: position }],
            width: sliderWidth * 0.2, // Adjust the slider thumb width
          },
        ]}
      >
        <Text style={styles.sliderText}>DELETE</Text>
      </Animated.View>
      {TargetIcon && (
        <View style={styles.iconContainer}>
          <TargetIcon height={30} width={30} color={isDragging ? 'darkred' : 'red'} />
        </View>
      )}
      {isPressed && <Text style={styles.completedText}>Action Triggered!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '5%',
    minHeight: 40,
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
    alignText: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 0,
  },
  sliderText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
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
