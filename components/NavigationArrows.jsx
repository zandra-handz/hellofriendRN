import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';

const { height: screenHeight } = Dimensions.get('window');

const NavigationArrows = ({ currentIndex, imageListLength, onPrevPress, onNextPress }) => {
  return (
    <View style={[styles.navigationContainer, { top: screenHeight * 0.4 }]}>
      {currentIndex > 0 ? (
        <TouchableOpacity 
          onPress={onPrevPress} 
          style={styles.arrowButton}
        >
          <ArrowLeftCircleOutlineSvg width={40} height={40} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
 
      {currentIndex < imageListLength - 1 ? (
        <TouchableOpacity 
          onPress={onNextPress} 
          style={styles.arrowButton}
        >
          <ArrowRightCircleOutlineSvg width={40} height={40} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row', 
    position: 'absolute',
    width: '100%', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Adjust padding as needed to prevent overlap
  },
  arrowButton: {
    padding: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 60,  
  },
});

export default NavigationArrows;
