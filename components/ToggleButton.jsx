import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Easing } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';

const ToggleButton = ({ value, onToggle }) => {

  const [bounceAnim] = useState(new Animated.Value(value ? 20 : 0));
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
 

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
      style={[styles.container, value ? styles.on : styles.off, {backgroundColor: value ? manualGradientColors.lightColor :  themeStyles.genericText.color}]}
      onPress={() => {
        onToggle();
      }}
    >
      <Animated.View style={[styles.circle, animatedStyle, {backgroundColor: manualGradientColors.homeDarkColor}]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 'auto',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: '.5%', 
    paddingVertical: '.5%',
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
  },
});

export default ToggleButton;
