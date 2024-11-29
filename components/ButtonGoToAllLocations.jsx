import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import MapSearchOutlineSvg from '../assets/svgs/map-search-outline.svg';
import ListCheckSvg from '../assets/svgs/list-check.svg';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import useLocationFunctions from '../hooks/useLocationFunctions';
import LocationsSavedList from '../components/LocationsSavedList';
import SearchBar from '../components/SearchBar';
import GoogleLogoSvg from '../assets/svgs/google-logo.svg';

const ButtonGoToAllLocations = ({onPress}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();
  const { themeAheadOfLoading } = useFriendList();
  const { locationList } = useLocationFunctions();
  
  const [expanded, setExpanded] = useState(false); 
  const animation = useRef(new Animated.Value(0)).current;  

  const handlePress = (location) => {
    onPress(location);
    //toggleButtons();

  };

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
    outputRange: [0, -200],  
  });
 
  return (
    <View style={styles.container}>  
 
 <Animated.View
      style={[
        styles.smallCircleButton,
        themeStyles.genericTextBackground,
        {
          transform: [{ translateX: buttonTranslateY }],
          opacity: animation,
          top: 0,
          zIndex: expanded ? 2000 : 1000, // Ensure higher zIndex when expanded
        },
      ]}
      pointerEvents={expanded ? 'auto' : 'none'} // Enable interaction only when expanded
    >
    <SearchBar data={locationList} useCustomIcon={true} customIcon={<ListCheckSvg width={24} height={24} color={manualGradientColors.lightColor} style={{marginRight: 10}} />
        } placeholderText={'Search saved locations'} onPress={handlePress} borderColor={'transparent'}  searchKeys={['address', 'title']} />
          
      </Animated.View>
 
      <TouchableOpacity
        onPress={toggleButtons}
        style={[
          styles.circleButton,
          themeStyles.footerIcon,
          { backgroundColor: manualGradientColors.homeDarkColor},
        ]}
      >
        {!expanded && (
 
        <ListCheckSvg width={24} height={24} color={manualGradientColors.lightColor} />
        )}
        {expanded && (
        <GoogleLogoSvg width={24} height={24} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    //position: 'absolute',
    
    flexWrap: 'wrap',
    width: 48,
    alignContent: 'center',
    justifyContent: 'center',
    //right: -14,
    //top: 204,
    zIndex: 1000,
  },
  circleButton: {
    width: 48,
    height: 48, 
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f',  
  },
  smallCircleButton: {
    position: 'absolute',
    width: 350,
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  sectionContainer: {
    padding: 30,
    borderRadius: 30,
    width: '100%', 
    zIndex: 1, 
    overflow:'hidden',
  },
});

export default ButtonGoToAllLocations;
