import React, { useState, useRef } from 'react'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import UpArrowNoStemSolidSvg from '../assets/svgs/up-arrow-no-stem-solid.svg';

import RotatableToggleButton from '../components/RotatableToggleButton';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ExpandableUpCard = ({ content, onPress=() => {} }) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const [expanded, setExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
 
  const cardHeight = useSharedValue(screenHeight / 3.08);  
  const rotation = useSharedValue(0);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(cardHeight.value, { duration: 300 }), // Smooth transition
    };
  });

  const toggleCard = () => {
    if (expanded) {
        cardHeight.value = screenHeight / 3.08;  
    } else {
        onPress();
        cardHeight.value = screenHeight; 
    };
    setExpanded(prev => !prev);

  };
   
  return (
    <Animated.View style={[styles.detailsContainer, animatedStyle, themeStyles.genericTextBackground, {zIndex: expanded ? 3000 : 2000} ]}>
    <View style={{ position: 'absolute', paddingTop: '2%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%',  alignContent: 'center', justifyContent: 'center',   alignSelf: 'center' }}>
  
    <RotatableToggleButton 
        expanded={expanded} 
        icon={UpArrowNoStemSolidSvg}
        iconSize={14}
        onPress={toggleCard} 
        backgroundColor={manualGradientColors.homeDarkColor}
        iconColor={manualGradientColors.lightColor}  
        rotation={rotation}
    />
        </View> 

      {content}
    </Animated.View>
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
