import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const HelloDayWrapper = ({ isVisible, children }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000, // Time to reach full opacity
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0.5, // Opacity goes back to 0.5 for pulsing effect
            duration: 1000, // Time to fade back to 0.5
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset to full opacity when not visible
      animation.setValue(1);
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: animation,  // Apply the animated opacity value
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    zIndex: 1,
    flex: 1, 
    width: '100%', 
    // Remove the absolute positioning if it's not needed
    // ...StyleSheet.absoluteFillObject,
  }, 
});

export default HelloDayWrapper;
