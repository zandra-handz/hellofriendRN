import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg';

const ButtonMomentChat = ({
  onPress,
  moment,
  size = 70,
  fontSize = 11,
  svgColor = 'gray',
  disabled = false,
  sameStyleForDisabled = false,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: size, height: size },
        !sameStyleForDisabled && disabled && styles.disabledContainer
      ]}
      onPress={!disabled ? onPress : null}
      disabled={disabled}
    >
      <View style={styles.svgContainer}>
        <BubbleChatSquareSolidSvg width="100%" height="100%" color={svgColor} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.momentText, { fontSize: fontSize }]}>
          {moment.capsule}
        </Text> 
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    top: 6,
    left: 4,
    width: '100%',
    height: '70%',
    padding: 10, // Adjust padding to fit text positioning
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align items to the left
    zIndex: 1, // Ensures content is above SVG
  },
  momentText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    marginBottom: 4,
  },
  creationDateText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'left',
  },
  disabledContainer: {
    opacity: 0.5,
  },
});

export default ButtonMomentChat;
