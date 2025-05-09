import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG


import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 

const MomentArchived = ({
  onPress,
  moment,
  iconSize = 12,  
  style,
  disabled = false,
  sameStyleForDisabled = false,
  includeDate= true, // New prop to control style
}) => {

  const { themeStyles } = useGlobalStyle();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        themeStyles.genericTextBackgroundShadeTwo,
        style, 
        !sameStyleForDisabled && disabled && styles.disabledContainer // Apply disabled style only if sameStyleForDisabled is false
      ]}
      onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
      disabled={disabled} // Disable the button interaction
    > 
        <View style={styles.iconContainer}>
          <ThoughtBubbleOutlineSvg width={iconSize} height={iconSize} color={themeStyles.modalIconColor.color} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.momentText, themeStyles.genericText]}>
            {moment.capsule}
          </Text>
        </View> 
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto', 
    flex: 1,
    width: '100%',
    //borderWidth: 1,
    borderRadius: 20,
    //borderColor: 'black',
    paddingVertical: 0,
    flexDirection: 'row',
    
    borderRadius: 20, 
    flexWrap: 'wrap', 
    
  },
  disabledContainer: {
    opacity: 0.5, // Visual indication of disabled state
  }, 
  momentText: {
    //fontFamily: 'Poppins-Regular',
    fontSize: 16, 
    lineHeight: 21,
    paddingLeft: 6,
    flexWrap: 'wrap', // Ensure text wrapping inside the text container
  },
  textWrapper: {
    flex: 1, // Take up the remaining space in the container
    flexShrink: 1, // Ensure it doesn't overflow its container
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  iconContainer: {  
    width: '10%', //adjust width of container if changing the absolute positioning of the icon
    flexDirection: 'column',
    justifyContent: 'center',
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

export default MomentArchived;