import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MapSearchOutlineSvg from '../assets/svgs/map-search-outline.svg';
import ShopAddOutlineSvg from '../assets/svgs/shop-add-outline.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';


const ButtonGoToFindLocation = () => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { calculatedThemeColors } = useSelectedFriend();
  
  const [expanded, setExpanded] = useState(false); 
  const animation = useRef(new Animated.Value(0)).current;  

  const toggleButtons = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  
  const buttonTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],  
  });


  const handleGoToLocationSearchScreen = () => {
    navigation.navigate('LocationSearch');
  };

  const handleGoToMidpointLocationSearchScreen = () => {
    navigation.navigate('MidpointLocationSearch');
  };

  return (
    <View style={styles.container}> 
      <Animated.View
        style={[
          styles.smallCircleButton,
          {
            transform: [{ translateY: buttonTranslateY }],
            opacity: animation,  
          },
        ]}
      >
        <TouchableOpacity onPress={handleGoToLocationSearchScreen} style={[styles.smallCircleButton, themeStyles.footerIcon]}>
          <MapSearchOutlineSvg width={32} height={32} color={calculatedThemeColors.fontColor} />
        </TouchableOpacity>
      </Animated.View>
 
      <Animated.View
        style={[
          styles.smallCircleButton,
          {
            transform: [{ translateY: buttonTranslateY }],
            opacity: animation, // Fades in/out with the animation
            top: 60, // Offset to position second button a bit lower than the first
          },
        ]}
      >
        <TouchableOpacity onPress={handleGoToMidpointLocationSearchScreen} style={[styles.smallCircleButton, themeStyles.footerIcon]}>
          <MapSearchOutlineSvg width={32} height={32} color={calculatedThemeColors.fontColor} />
        </TouchableOpacity>
      </Animated.View>
 
      <TouchableOpacity
        onPress={toggleButtons}
        style={[
          styles.circleButton,
          themeStyles.footerIcon,
          { backgroundColor: calculatedThemeColors.darkColor },
        ]}
      >
        <ShopAddOutlineSvg width={48} height={48} color={calculatedThemeColors.fontColor} />
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
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f',  
  },
  smallCircleButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',  
  },
});

export default ButtonGoToFindLocation;
