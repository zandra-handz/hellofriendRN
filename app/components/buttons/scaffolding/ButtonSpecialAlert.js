import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const ButtonSpecialAlert = ({ onPress, title, size }) => {
  const sparkleValue = useRef(new Animated.Value(0)).current;
  const {themeStyles } = useGlobalStyle();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          sparkleValue,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          sparkleValue,
          {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }
        ),
      ])
    ).start();
  }, [sparkleValue]);

  const sparkleOpacity = sparkleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, .2], 
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {title && (

     
      <Text style={{ color: themeStyles.subHeaderText, fontWeight: 'bold', marginRight: 10 }}>{title}</Text>
      )}
      <Animated.View style={{ opacity: sparkleOpacity }}> 
        <FontAwesome name="magic" size={size} color={themeStyles.modalIconColor.color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ButtonSpecialAlert;
