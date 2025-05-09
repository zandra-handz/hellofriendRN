import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const HorizontalScrollAnimationWrapper = ({ children, style }) => {
  const animation = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const buttonTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
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
    flex: 1,
    width: '100%',  
    }, 
});

export default HorizontalScrollAnimationWrapper;
