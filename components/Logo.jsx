import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';

const Logo = ({
  shapeSource,
  shapeWidth = 200,
  shapeHeight = 200,
  shapePosition = 'left',
  shapePositionValue = 0,
  shapePositionVerticalValue = 0,
}) => {
  const { themeStyles, gradientColors } = useGlobalStyle(); 

  const getShapeStyle = () => {
    let positionStyle = {};
    switch (shapePosition) {
      case 'left':
        positionStyle = { left: shapePositionValue };
        break;
      case 'center':
        positionStyle = { left: '33.33%' }; // Adjust as needed
        break;
      case 'right':
        positionStyle = { right: shapePositionValue };
        break;
      default:
        positionStyle = { left: 0 };
    }
    positionStyle.top = shapePositionVerticalValue; // Adjust vertical position

    return positionStyle;
  };

  return (
    <View style={styles.container}>
      <Image
        source={shapeSource}
        style={[
          styles.shape, themeStyles.logoShape,
          { width: shapeWidth, height: shapeHeight }, // Apply shape color
          getShapeStyle()
        ]}
        resizeMode="contain"
      />
      <View style={styles.titleContainer}>
        <Text style={[  themeStyles.logoTextOutline, styles.titleOutlineTopLeft]}>hellofr::nd</Text>
        <Text style={[  themeStyles.logoTextOutline, styles.titleOutlineTopRight]}>hellofr::nd</Text>
        <Text style={[  themeStyles.logoTextOutline, styles.titleOutlineBottomLeft]}>hellofr::nd</Text>
        <Text style={[ themeStyles.logoTextOutline, styles.titleOutlineBottomRight]}>hellofr::nd</Text>

          <Text style={[styles.title, themeStyles.logoText ]}>
            hellofr::nd
          </Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  shape: {
    position: 'absolute',
  },
  titleContainer: {
    position: 'relative',
  },
  title: {
    fontSize: 64,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    backgroundColor: 'transparent', // Transparent background
    padding: .4, // Adjust padding as needed to fit the text
  },
  titleOutline: {
    position: 'absolute', 
    fontFamily: 'Poppins-Bold',
    fontSize: 64,
  },
  titleOutlineTopLeft: {
    left: -1,
    top: -1,
  },
  titleOutlineTopRight: {
    right: -1,
    top: -1,
  },
  titleOutlineBottomLeft: {
    left: -1,
    bottom: -1,
  },
  titleOutlineBottomRight: {
    right: -1,
    bottom: -1,
  },
  gradientTextContainer: {
    // Ensure container has the same size as the text
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientText: {
    // Apply necessary styles here if needed
    backgroundColor: 'transparent', // Ensure no background
  },
});

export default Logo;
