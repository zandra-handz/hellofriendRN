import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SpeechBubbleIconHeartSvg from '../assets/svgs/speech-bubble-icon-heart.svg';

import { useGlobalStyle } from '../context/GlobalStyleContext';

import FormatDate from '../components/FormatDate';

const ButtonMoment = ({
  onPress,  
  moment, 
  size = 15, 
  style,
  disabled = false,
  sameStyleForDisabled = false, // New prop to control style
}) => {

  const { themeStyles } = useGlobalStyle();


  return (
    <TouchableOpacity 
      style={[
        styles.container, themeStyles.genericTextBackground,
        style, 
        !sameStyleForDisabled && disabled && styles.disabledContainer,
        // Apply disabled style only if sameStyleForDisabled is false
      ]}
      onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
      disabled={disabled} // Disable the button interaction
    >
      <View style={styles.iconAndMomentContainer}>
        <View style={styles.iconContainer}> 
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.momentText, themeStyles.genericText, { fontSize: size }]}>
            {moment.capsule}
          </Text>
        </View>
      </View>
      <View style={styles.creationDateSection}>
        <View style={styles.creationDateTextContainer}>
          <FormatDate  
            date={moment.created} 
            fontSize={11} 
            month={true} 
            monthAbr={true} 
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
    borderBottomWidth: .2,
    borderRadius: 30,
    padding: 12,  
    borderColor: '#ccc',
    flexDirection: 'column', 
    
    margin: 0,
    // Removed flex and fixed height constraints to allow natural height adjustment
  },
  disabledContainer: {
    opacity: 0.5, // Visual indication of disabled state
  },
  iconAndMomentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 0,
    paddingTop: 0,
    flexWrap: 'wrap', // Allow wrapping of children
    backgroundColor: 'transparent', // Optional: make sure background is set to avoid overlap issues
  },
  momentText: { 
    fontFamily: 'Poppins-Regular', 
    margin: 8, 
    flexShrink: 1,  // Allows the text to shrink if needed
  },
  textWrapper: {
    flex: 1, 
    // Removed fixed height
  },
  iconContainer: { 
    justifyContent: 'center',
    marginRight: 0, // Adjusted margin to align the icon better with the text
    // Removed fixed height
  },
  creationDateSection: {   
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',  
  },
  creationDateTextContainer: {  
    paddingBottom: 2,
    paddingRight: 8, 
    
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
});

export default ButtonMoment;
