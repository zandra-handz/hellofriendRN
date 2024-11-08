import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimationGreenOut = ({
  loading,
  color = '#000002',
  duration = 2200, // Duration of the wave animation
}) => {
  // Animated values for wave movement
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-1)).current; // Start from left (-1)

  useEffect(() => {
    if (loading) {
      // Start the wave animation
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600, // Fade in
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 1, // Move the wave to the right
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset the wave when loading is false
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600, // Fade out
        useNativeDriver: true,
      }).start();
    }
  }, [loading, opacity, translateX, duration]);

  // Return null if not loading
  if (!loading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.waveEffect,
          {
            opacity: opacity,
            transform: [{ translateX: translateX }],
          },
        ]}
      >
        <View style={[styles.wave, { backgroundColor: color }]}></View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // This ensures the animation covers the entire parent container
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 9999, // Ensure it's on top
  },
  waveEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    width: '100%', // Full width of the parent container
    height: '100%', // Full height of the parent container
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default AnimationGreenOut;
