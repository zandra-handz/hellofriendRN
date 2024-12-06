import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import SlideToAdd from '../components/SlideToAdd'; 
import FormatMonthDay from '../components/FormatMonthDay';
import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import { Easing } from 'react-native-reanimated';

const MomentCard = ({
  onPress,  
  onSliderPull, 
  moment, 
  size,   
  sliderVisible,
  disabled = false, 
}) => {

  const { themeStyles } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();



  useEffect(() => {
    if (updateCapsuleMutation.isSuccess && moment.id === momentData?.id){
      triggerAnimation();
      console.log('removed triggering animation in moment card for now');
    }
  }, [updateCapsuleMutation.isSuccess]);

  
  const translateX = new Animated.Value(0);   
 
  const triggerAnimation = () => {
    Animated.timing(translateX, {
      toValue: 500, // Adjust to slide it off-screen
      duration: 200, // Duration of the animation
      easing: Easing.ease,
      useNativeDriver: true,  // Enable native driver for better performance
    }).start(() => {  // onComplete callback
      console.log('Animation finished, updating cache!');
      //updateCacheWithNewPreAdded();  // Call updateCacheWithNewPreAdded once animation is done
    });
  };

  return (
    <Animated.View
      style={[ 
        styles.container,
        themeStyles.genericTextBackground,
        { transform: [{ translateX }] },  
      ]}
    >
      <TouchableOpacity 
        style={{width: '100%', flex: 1}}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled} 
      >
        <View style={styles.iconAndMomentContainer}> 
         <View style={styles.categoryHeader}>
          <View style={{flexDirection: 'row'}}>
            
          <Animated.Text style={[styles.categoryText, { color: 'darkgrey', opacity: sliderVisible }]}>
            {moment.typedCategory.length > 20 
              ? `${moment.typedCategory.substring(0, 20)}...` 
              : moment.typedCategory} • added </Animated.Text>
          <FormatMonthDay  
            date={moment.created} 
            fontSize={13}  
            fontFamily={'Poppins-Regular'} 
            parentStyle={styles.categoryText}
            opacity={sliderVisible}
          /> 
          
          </View>
          </View>
          <View style={styles.textWrapper}>
          <Animated.Text numberOfLines={3} style={[styles.momentText, themeStyles.genericText, { fontSize: size, opacity: sliderVisible }]}>
              {moment.capsule}
            </Animated.Text>
          </View>
          
        </View> 
      </TouchableOpacity>
      <Animated.View style={[styles.sliderContainer, { opacity: sliderVisible }]}>
        <SlideToAdd
          onPress={onSliderPull}
          sliderText='ADD TO HELLO'  
          targetIcon={CheckmarkOutlineSvg}
          disabled={sliderVisible !== 1}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {  
    height: 162,
    borderRadius: 50,
    width: '100%', 
    paddingHorizontal: '6%',
    paddingTop: '3%',
    paddingBottom: '4%',
    flexDirection: 'column',  
  },
  sliderContainer: {
    height: 24,
    borderRadius: 20,  
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disabledContainer: {
    opacity: 0.5,  
  },
  iconAndMomentContainer: {
    flexDirection: 'column', 
    height: '100%',
    alignItems: 'center',
    width: '100%', 
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    
  },
  momentText: {   
    fontFamily: 'Poppins-Regular',  
    flexShrink: 1, 
    fontSize: 16,
    lineHeight: 21,
    alignSelf: 'left',
  },
  textWrapper: { 
    flexGrow: 1,
    textAlign: 'left',
    width: '100%',
  },
  categoryText: { 
    fontSize: 14,
    flexShrink: 1, 
    lineHeight: 21,
    color: 'darkgrey',
    overflow:'hidden',
    //textTransform: 'uppercase',

  },
  categoryHeader: {
    paddingBottom: '1%',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    minHeight: 20,
    height: 'auto',
    maxHeight: 50,

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
    zIndex: 2,
  }, 
});

export default MomentCard;
