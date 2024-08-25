import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SpeechBubbleIconHeartSvg from '../assets/svgs/speech-bubble-icon-heart.svg';
import ThoughtBubbleIconPinkHeartSvg from '../assets/svgs/thought-bubble-icon-pink-heart.svg';

import FormatDate from '../components/FormatDate';

const ButtonMoment = ({
  //Border can be turned on by setting width in styles
  onPress,  
  moment,
  iconSize = 12,
  size = 12,
  color = "black",
  style,
  disabled = false,
  sameStyleForDisabled = false, // New prop to control style
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        style, 
        !sameStyleForDisabled && disabled && styles.disabledContainer // Apply disabled style only if sameStyleForDisabled is false
      ]}
      onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
      disabled={disabled} // Disable the button interaction
    >
      <View style={styles.iconAndMomentContainer}>
        <View style={styles.iconContainer}>
          <SpeechBubbleIconHeartSvg width={iconSize} height={iconSize} color={color} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.momentText, { fontSize: size, color: color }]}>
            {moment.capsule}
          </Text>
        </View>
      </View>
      <View style={styles.creationDateSection}>
        <View style={styles.creationDateTextContainer}>
          <FormatDate 
            date={moment.created} 
            fontSize={12} 
            month={true} 
            monthAbr={false} 
            dayAsNumber={true} 
            year={true} 
            noOutputIfCurrentYear={true} 
            commas={false}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    borderColor: 'black',
  },
  disabledContainer: {
    opacity: 0.5, // Visual indication of disabled state
  },
  iconAndMomentContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%', 
    padding: 10,
    paddingTop: 4,
    overflow: 'hidden',
    borderRadius: 20, 
    flexWrap: 'wrap', // Allow wrapping of children
    backgroundColor: 'transparent', // Optional: make sure background is set to avoid overlap issues
  },
  momentText: { 
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
    flexWrap: 'wrap',   
    height: '80%',
  },
  textWrapper: {
    flex: 1, 
    flexShrink: 1,  
  },
  iconContainer: { 
    alignItems: 'left', 
    justifyContent: 'flex-start',
    left: -10,
    top: -20, 
    borderRadius: 20, 
    width: '8%',
    height: '100%',
  },
  creationDateSection: {    
    position: 'absolute', 
    bottom: 0, 
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  creationDateTextContainer: {  
    paddingBottom: 10,
    paddingRight: 10, 
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
});

export default ButtonMoment;
