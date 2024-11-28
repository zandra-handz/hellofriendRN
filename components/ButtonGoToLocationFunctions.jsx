import React, { useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import ButtonSDOptionSendLoc from '../components/ButtonSDOptionSendLoc';
import ButtonSDOptionCalculateTravel from '../components/ButtonSDOptionCalculateTravel';
import ButtonBaseSDMain from '../components/ButtonBaseSDMain';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import RightArrowNoStemSolidSvg from '../assets/svgs/right-arrow-no-stem-solid.svg';

const ButtonGoToLocationFunctions = () => {  
  const { manualGradientColors } = useGlobalStyle();
  const [expanded, setExpanded] = useState(false);
  const animation1 = useRef(new Animated.Value(0)).current;  
  const animation2 = useRef(new Animated.Value(0)).current;  
  const rotation = useRef(new Animated.Value(0)).current; // New animation value for rotation

  const toggleButtons = () => {
    if (!expanded) { 
      setExpanded(true);
      
      Animated.parallel([
        Animated.timing(animation1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation2, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Collapse
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 0, // Reset rotation for collapse
          duration: 100, // Duration for rotation
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animation2, {
            toValue: 0,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => setExpanded(false));
    }
  };

  const buttonTranslateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],  
  });

  const buttonTranslateY2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80], // Adjust to your desired spacing
  });
 

  return (
    <View style={styles.container}> 
      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            transform: [{ translateY: buttonTranslateY2 }],
            opacity: animation2,
          },
        ]}
      >
        <ButtonSDOptionSendLoc />
      </Animated.View>
 
      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            transform: [{ translateY: buttonTranslateY1 }],
            opacity: animation1,
            top: 0,
          },
        ]}
      >
        <ButtonSDOptionCalculateTravel />
      </Animated.View>
 
      <ButtonBaseSDMain 
        expanded={expanded} 
        icon={RightArrowNoStemSolidSvg}
        iconSize={52}
        onPress={toggleButtons} 
        backgroundColor={manualGradientColors.homeDarkColor}
        iconColor={manualGradientColors.lightColor}  
        rotation={rotation} // Pass rotation to the main button
      />
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
    zIndex: 3000,
  },
  smallButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',   
    width: 50,
    height: 50,
  },  
});

export default ButtonGoToLocationFunctions;
