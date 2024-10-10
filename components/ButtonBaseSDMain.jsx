import React, { useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonBaseSDMain = ({ 
        expanded, 
        onPress, 
        icon: Icon,
        iconSize=52,
        calculatedThemeColors, 
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
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.circleButton, {backgroundColor : calculatedThemeColors.darkColor}]}
    >
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        {Icon && (
        <Icon width={iconSize} height={iconSize} color={calculatedThemeColors.fontColor} />
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
