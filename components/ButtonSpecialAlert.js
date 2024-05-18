import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from @expo/vector-icons

const ButtonSpecialAlert = ({ onPress, title }) => {
  const sparkleValue = useRef(new Animated.Value(0)).current;

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
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: 'black', fontWeight: 'bold', marginRight: 10 }}>{title}</Text>
      <Animated.View style={{ opacity: sparkleOpacity }}> 
        <FontAwesome name="magic" size={20} color="black" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ButtonSpecialAlert;
