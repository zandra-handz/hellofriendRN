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
      <Text style={[styles.title, { color: fontColor }]}>hellofr::nd</Text>
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
  title: {
    fontSize: 62,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    backgroundColor: 'transparent', // Transparent background
  },
});

export default Logo;
