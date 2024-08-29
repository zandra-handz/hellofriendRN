// ArrowButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ProfileCircleSvg from '../assets/svgs/profile-circle.svg';

const ButtonArrowSvgAndLabel = ({ direction = 'right', label, onPress, screenSide = 'left' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.arrowButton, screenSide === 'left' ? styles.marginRight : styles.marginLeft]}
    >
      <View style={{ width: '90%', position: 'absolute', top: -16 }}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, textAlign: 'center', color: 'black' }}>
          {label}
        </Text>
      </View>
      <View style={styles.svgContainer}>
        {direction === 'right' ? (
          <ArrowRightCircleOutlineSvg width={46} height={46} style={styles.SvgImage} />
        ) : direction === 'left' ? (
          <ArrowLeftCircleOutlineSvg width={46} height={46} style={styles.SvgImage} />
        ) : (
          <ProfileCircleSvg width={46} height={46} style={styles.SvgImage} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowButton: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: '2%',
  },
  marginRight: {
    marginRight: '2%',
  },
  svgContainer: {
    width: 54,
    height: '40%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SvgImage: {
    color: 'black',
  },
});

export default ButtonArrowSvgAndLabel;