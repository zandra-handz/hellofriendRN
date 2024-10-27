import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Easing } from 'react-native';

const ToggleButton = ({ value, onToggle }) => {
  const [bounceAnim] = useState(new Animated.Value(value ? 20 : 0));
 

  useEffect(() => {
    const newValue = value ? 20 : 0;
    Animated.timing(bounceAnim, {
      toValue: newValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const animatedStyle = {
    transform: [
      {
        translateX: bounceAnim,
      },
    ],
  };

  const accessibilityLabel = value ? 'Enabled' : 'Disabled';
  const accessibilityState = { selected: value };

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Toggle button. ${accessibilityLabel}`}
      accessibilityState={accessibilityState}
      style={[styles.container, value ? styles.on : styles.off]}
      onPress={() => {
        onToggle();
      }}
    >
      <Animated.View style={[styles.circle, animatedStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#ccc',
  },
  on: {
    backgroundColor: '#4cd137',
  },
  off: {
    backgroundColor: '#dcdde1',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default ToggleButton;
