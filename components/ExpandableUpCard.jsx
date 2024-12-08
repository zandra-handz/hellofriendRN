import React, { useState, useEffect } from 'react'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import UpArrowNoStemSolidSvg from '../assets/svgs/up-arrow-no-stem-solid.svg';

import RotatableToggleButton from '../components/RotatableToggleButton';
import { Keyboard,  View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ExpandableUpCard = ({ content, useParentButton=false, parentTriggerToExpand, parentTriggerToCollapse, parentFunctionToTrackOpenClose, onPress=() => {} }) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const [expanded, setExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
 
  const cardHeight = useSharedValue(screenHeight / 3.4);  
  const rotation = useSharedValue(0);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  useEffect(() => {
    if (parentTriggerToExpand && useParentButton) {
      toggleCard();
  
    }
    if (!parentTriggerToExpand && useParentButton) {
      closeCard();
    }

  }, [parentTriggerToExpand]);
 

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isKeyboardVisible) {
      cardHeight.value = screenHeight / 8;
    } else {
      cardHeight.value = screenHeight / 3.4; 

    }

  }, [isKeyboardVisible]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(cardHeight.value, { duration: 300 }), // Smooth transition
    };
  });

  const toggleCard = () => {
    parentFunctionToTrackOpenClose();
    if (expanded) {
        cardHeight.value = screenHeight / 3.4;  
    } else {
        onPress();
        cardHeight.value = screenHeight; 
    };
    setExpanded(prev => !prev);

  };

  const closeCard = () => {
    
    if (expanded) {
      parentFunctionToTrackOpenClose();
        cardHeight.value = screenHeight / 3.4;  
        setExpanded(false);
    }   

  };

   
  return (
    <>
    {!isKeyboardVisible && (

    
    <Animated.View style={[styles.detailsContainer, animatedStyle, themeStyles.genericTextBackground, {zIndex: expanded ? 3000 : 2000} ]}>
    {!useParentButton && (
      
    <View style={{ position: 'absolute', paddingTop: '2%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%',  alignContent: 'center', justifyContent: 'center',   alignSelf: 'center' }}>
  
    <RotatableToggleButton 
        expanded={expanded} 
        icon={UpArrowNoStemSolidSvg}
        iconSize={14}
        onPress={toggleCard} 
        backgroundColor={manualGradientColors.homeDarkColor}
        iconColor={manualGradientColors.darkColor}  
        rotation={rotation}
    />
        </View> 
        
    )}

        {content ? content : <Text>No content available</Text>}
    </Animated.View>
    )}
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    width: '100%',
    padding: 30,
    paddingTop: 40,
    
    position: 'absolute',  // Keeping absolute positioning for expanding to full screen
    bottom: 0,  
    right: 0,
    zIndex: 1100,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50, 
    overflow: 'hidden', // Prevent content from overflowing when expanding
  },
  button: {
    height: 30,
    width: 100,
    backgroundColor: 'pink',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsSubtitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ExpandableUpCard;
