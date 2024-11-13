import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import SlideToAdd from '../components/SlideToAdd';
import FormatDate from '../components/FormatDate';
import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';
import LoadingPage from '../components/LoadingPage';


const MomentCard = ({
  onPress,  
  onSliderPull,
  height,
  moment, 
  size = 15, 
  style,
  disabled = false,
  onTop = false,
  sameStyleForDisabled = false, // New prop to control style
}) => {

  const { themeStyles } = useGlobalStyle();


  return (
    <View style={[
      styles.container, themeStyles.genericTextBackground ]}>

    
    <TouchableOpacity 
      style={{width: '100%', flex: 1}}
      onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
      disabled={disabled} // Disable the button interaction
    >
      <View style={styles.iconAndMomentContainer}>
        <View style={styles.iconContainer}> 
        </View>
        <View style={styles.textWrapper}>
          <Text numberOfLines={2} style={[styles.momentText, themeStyles.genericText, { fontSize: size }]}>
            {moment.capsule}
          </Text>
        </View>
      </View>
      <View style={styles.creationDateSection}>
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

    </TouchableOpacity>
    <View style={styles.sliderContainer}>
        
        <SlideToAdd
       onPress={onSliderPull}
       sliderText='SHARED'
       sliderWidth={'100%'} 
       targetIcon={CheckmarkOutlineSvg}
     />
     
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    height: 160,
    borderRadius: 10,
    width: '100%', 
    paddingHorizontal: 0,
    paddingTop: 14,  
    paddingBottom: 6, 
    flexDirection: 'column', 
    
    margin: 0,
    // Removed flex and fixed height constraints to allow natural height adjustment
  },
  sliderContainer: {
    height: 30,
    borderRadius: 20,

  },
  disabledContainer: {
    opacity: 0.5,  
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
    lineHeight: 24,
  },
  textWrapper: {
    flex: 1, 
    // Removed fixed height
  },
  iconContainer: { 
    justifyContent: 'center', 
  },
  creationDateSection: {   
    borderRadius: 20,
    paddingHorizontal: '4%',
    paddingVertical: '4%',
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

export default MomentCard;
