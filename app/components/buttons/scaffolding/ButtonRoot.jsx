import React, { useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native'; 

import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";



const ButtonRoot  = ({ 
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
        duration: 100, 
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
      style={[styles.circleButton, {backgroundColor: backgroundColor, borderColor: iconColor}]}
    >
                  <View style={{ position: "absolute", bottom: 13, right: 4 }}>
                    <AddOutlineSvg
                      width={20}
                      height={20}
                      color={iconColor}
                    />
                  </View>
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
    zIndex: 3000,
    elevation: 3000,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default ButtonRoot;
