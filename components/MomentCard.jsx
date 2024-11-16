import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import SlideToAdd from '../components/SlideToAdd';
import FormatDate from '../components/FormatDate';
import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';
import { Easing } from 'react-native-reanimated';

const MomentCard = ({
  onPress,  
  onSliderPull, 
  moment, 
  size = 15,  
  addIsSuccessful = false,
  disabled = false, 
}) => {

  const { themeStyles } = useGlobalStyle();
  const { updateCapsuleMutation, updateCacheWithNewPreAdded, momentData } = useCapsuleList();

  useEffect(() => {
    console.log('card rerendered for ', moment.capsule);

  }, []);

  useEffect(() => {
    if (updateCapsuleMutation.isPending){
      console.log('Hello is being added');
    }
  }, [updateCapsuleMutation.isPending]);

  useEffect(() => {
    if (updateCapsuleMutation.isSuccess && moment.id === momentData.id){
      triggerAnimation();
    }
  }, [updateCapsuleMutation.isSuccess]);

  // Define Animated values
  const translateX = new Animated.Value(0);  // Start at the original position

  // Function to trigger the animation
  const triggerAnimation = () => {
    Animated.timing(translateX, {
      toValue: 500, // Adjust to slide it off-screen
      duration: 500, // Duration of the animation
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
        { transform: [{ translateX }] },  // Apply the translateX transformation to slide off-screen
      ]}
    >
      <TouchableOpacity 
        style={{width: '100%', flex: 1}}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled} // Disable the button interaction
      >
        <View style={styles.iconAndMomentContainer}>
          <View style={styles.iconContainer}> 
          </View>
          <View style={styles.textWrapper}>
            <Text numberOfLines={3} style={[styles.momentText, themeStyles.genericText, { fontSize: size }]}>
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
          sliderText='ADD'  
          targetIcon={CheckmarkOutlineSvg}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {  
    height: 160,
    borderRadius: 30,
    width: '100%', 
    padding: 20, 
    flexDirection: 'column', 
    margin: 0,
  },
  sliderContainer: {
    height: 30,
    borderRadius: 20,  
    zIndex: 3,
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
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
  momentText: { 
    fontFamily: 'Poppins-Regular', 
    margin: 8, 
    flexShrink: 1, 
    lineHeight: 24,
  },
  textWrapper: {
    flex: 1, 
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
  creationDateTextContainer: {  
    paddingBottom: 2,
    paddingRight: 8, 
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
});

export default MomentCard;
