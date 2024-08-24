
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';

const NavigationArrows = ({ currentIndex, imageListLength, onPrevPress, onNextPress }) => {
  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity 
        onPress={onPrevPress} 
        disabled={currentIndex === 0}
        style={styles.arrowButton}
      >
        <ArrowLeftCircleOutlineSvg width={40} height={40} color={currentIndex === 0 ? 'gray' : 'black'} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onNextPress} 
        disabled={currentIndex === imageListLength - 1}
        style={styles.arrowButton}
      >
        <ArrowRightCircleOutlineSvg width={40} height={40} color={currentIndex === imageListLength - 1 ? 'gray' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row', 
    position: 'absolute',
    width: '100%', 
    top: '40%',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  arrowButton: {
    padding: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavigationArrows;
