import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const SearchBarAnimationWrapper = ({ children, style }) => {
  const animation = useRef(new Animated.Value(0)).current;

  // Trigger animation on mount
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const buttonTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [260, 0],
  });

  return (
    <Animated.View
      style={[styles.animatedContainer, style, { transform: [{ translateX: buttonTranslateY }], opacity: animation }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { 
    flexDirection: 'row', 
   // position: 'absolute', 
    width: '100%', // Make input field take up full width
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center', 
    }, 
});

export default SearchBarAnimationWrapper;
