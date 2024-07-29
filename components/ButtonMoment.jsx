import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SpeechBubbleIconHeartSvg from '../assets/svgs/speech-bubble-icon-heart.svg';
import ThoughtBubbleIconPinkHeartSvg from '../assets/svgs/thought-bubble-icon-pink-heart.svg';

import FormatDate from '../components/FormatDate';


const ButtonMoment = ({ onPress, moment, iconSize = 12, size = 12, color = "black", style }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress} // Add onPress handler here
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
          <FormatDate date={moment.created} fontSize={12} month={true} monthAbr={false} dayAsNumber={true} year={true} noOutputIfCurrentYear={true} commas={false}/>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
  },
  iconAndMomentContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%', 
    padding: 20,
    borderRadius: 20, 
    flexWrap: 'wrap', // Allow wrapping of children
    backgroundColor: 'transparent', // Optional: make sure background is set to avoid overlap issues
  },
  momentText: {
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
    flexWrap: 'wrap', // Ensure text wrapping inside the text container
  },
  textWrapper: {
    flex: 1, // Take up the remaining space in the container
    flexShrink: 1, // Ensure it doesn't overflow its container
  },
  iconContainer: { 
    alignItems: 'left', 
    borderRadius: 20,
    flex: .1,
    height: '100%',

  },
  creationDateSection: {   
    backgroundColor: 'transparent',
    alignItems: 'flex-end', 
  },
  creationDateTextContainer: {
    width: '33.3%',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,

  },
});

export default ButtonMoment;
