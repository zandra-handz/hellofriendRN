import React, { useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
 

const ButtonBaseSDMain = ({ 
        expanded, 
        onPress, 
        icon: Icon,
        iconSize=52,
        backgroundColor,
        iconColor, 
        rotation }) => {
    
  
    useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 100, // Duration for rotation when expanding
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.circleButton, {backgroundColor: backgroundColor}]}
    >
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        {Icon && (
        <Icon width={iconSize} height={iconSize} color={iconColor} />
        )}
        </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default ButtonBaseSDMain;
