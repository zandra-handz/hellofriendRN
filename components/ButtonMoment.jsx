import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SpeechBubbleIconHeartSvg from '../assets/svgs/speech-bubble-icon-heart.svg';

const ButtonMoment = ({ onPress, moment, iconSize = 12, size = 12, color = "black", style }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress} // Add onPress handler here
    >
      <View style={styles.iconContainer}>
        <SpeechBubbleIconHeartSvg width={iconSize} height={iconSize} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.momentText, { fontSize: size, color: color }]}>
          {moment.capsule}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 20,
    borderColor: 'black',
    width: '100%',
    padding: 20,
    flexWrap: 'wrap', // Allow wrapping of children
    backgroundColor: 'white', // Optional: make sure background is set to avoid overlap issues
  },
  momentText: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
    flexWrap: 'wrap', // Ensure text wrapping inside the text container
  },
  textWrapper: {
    flex: 1, // Take up the remaining space in the container
    flexShrink: 1, // Ensure it doesn't overflow its container
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center', // Align the icon vertically
  },
});

export default ButtonMoment;
