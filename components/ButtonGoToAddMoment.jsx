import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MessageAddSolidSvg from '../assets/svgs/message-add-solid.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import AddOutlineSvg from '../assets/svgs/add-outline.svg';



const ButtonGoToAddMoment = () => {
  const { themeStyles,   manualGradientColors} = useGlobalStyle();
  const navigation = useNavigation(); 

  const viewSvg = true;

 
  const handleGoToMomentScreen = () => {
    navigation.navigate('MomentFocus');
  };

  return ( 
    <View style={[styles.container]}> 
      <TouchableOpacity onPress={handleGoToMomentScreen} style={[styles.circleButton, themeStyles.footerIcon, {borderColor: manualGradientColors.lightColor, backgroundColor: manualGradientColors.homeDarkColor}]}> 
        {!viewSvg && (  
        <Text style={[styles.controlButtonText, themeStyles.footerText]}>Add moment</Text>
        )}
        {viewSvg && (  
          <>
                          <View style={{ position: "absolute", bottom: 13, right: 12 }}>
                            <AddOutlineSvg
                              width={20}
                              height={20}
                              color={manualGradientColors.darkColor} 
                            />
                          </View>
        <ThoughtBubbleOutlineSvg width={40} height={40} color={manualGradientColors.darkColor} />
        </>
        )}
      </TouchableOpacity>  
      </View> 
  );
};

const styles = StyleSheet.create({
  container: {   
    alignItems: 'center',  
    position: 'absolute',
    flexWrap: 'wrap',
    width: 73, 
    alignContent: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 20,
    zIndex: 1,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  saveButton: {  
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    justifyContent: 'center',
  },
  circleButton: {  
    width: 70, // Set width and height to the same value
    height: 70,
    borderRadius: 35, // Half of the width/height to make it a perfect circle
    
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center', // Ensure the content is centered within the circle
    backgroundColor: '#f0f', // Optional: set a background color to make it visible
  },
  checkbox: {
    paddingLeft: 10,  
    paddingBottom: 2,
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular', 
    justifyContent: 'center',
    textAlign: 'center', 
    alignContent: 'center',
  },
});

export default ButtonGoToAddMoment;
