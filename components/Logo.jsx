import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Logo = ({
  shapeSource,
  shapeWidth = 200,
  shapeHeight = 200,
  shapePosition = 'left',
  shapePositionValue = 0,
  shapePositionVerticalValue = 0,
  fontColor = 'black', // Default font color
  shapeColor = 'transparent', // Default shape color
}) => {
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
          styles.shape,
          { width: shapeWidth, height: shapeHeight, tintColor: shapeColor }, // Apply shape color
          getShapeStyle()
        ]}
        resizeMode="contain"
      />
      <View style={styles.titleContainer}>
        <Text style={[styles.titleOutline, styles.titleOutlineTopLeft]}>hellofr::nd</Text>
        <Text style={[styles.titleOutline, styles.titleOutlineTopRight]}>hellofr::nd</Text>
        <Text style={[styles.titleOutline, styles.titleOutlineBottomLeft]}>hellofr::nd</Text>
        <Text style={[styles.titleOutline, styles.titleOutlineBottomRight]}>hellofr::nd</Text>
        <Text style={[styles.title, { color: fontColor }]}>hellofr::nd</Text>
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
    fontSize: 62,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    backgroundColor: 'transparent', // Transparent background
  },
  titleOutline: {
    position: 'absolute',
    fontSize: 62,
    fontFamily: 'Poppins-Bold',
    color: 'white',
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
});

export default Logo;
