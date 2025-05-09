import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const HelloDayWrapper = ({ isVisible, children }) => {
  const animation = useRef(new Animated.Value(1)).current; // Start with full opacity

  useEffect(() => {
    if (isVisible) {
      // Define animation durations
      const animationDurations = {
        slow: 3000,
        regular: 2000,
        fast: 800,
      };

      // Pick a random duration
      const randomKey = Math.floor(Math.random() * 3); // 0, 1, or 2
      const selectedDuration =
        randomKey === 0
          ? animationDurations.slow
          : randomKey === 1
          ? animationDurations.regular
          : animationDurations.fast;

      // Generate a random delay between 0 and 500ms
      const randomDelay = Math.floor(Math.random() * 500);

      const startAnimation = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 1, // Opacity goes to 1
              duration: selectedDuration, // Fade in
              useNativeDriver: true,
            }),
            Animated.timing(animation, {
              toValue: 0.4, // Opacity goes to 0.6, ensuring it stays visible
              duration: selectedDuration, // Fade out to 0.6
              useNativeDriver: true,
            }),
            Animated.timing(animation, {
              toValue: 1, // Opacity goes back to 1
              duration: selectedDuration, // Fade back to 1
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      // Start animation after random delay
      const timeout = setTimeout(startAnimation, randomDelay);

      // Cleanup timeout if component unmounts or isVisible changes
      return () => clearTimeout(timeout);
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
          opacity: animation, // Apply the animated opacity value
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
  },
});

export default HelloDayWrapper;
