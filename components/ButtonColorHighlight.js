import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import the global style context

const ButtonColorHighlight = ({
  onPress,
  title,
  showGradient = true,
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
  shapeSource,
  shapeWidth = 260,
  shapeHeight = 260,
  shapePosition = 'left',
  shapePositionValue = -134, // Default shape position value
  shapePositionVerticalValue = 0, // Default vertical position of the shape
}) => {
  const globalStyles = useGlobalStyle(); // Get the global styles

  const textStyles = {
    fontSize: globalStyles.fontSize === 20 ? 22 : 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: globalStyles.highContrast ? 'Poppins-Bold' : 'Poppins-Regular',
  };

  const getShapeStyle = () => {
    let positionStyle = {};
    switch (shapePosition) {
      case 'left':
        positionStyle = { left: shapePositionValue };
        break;
      case 'center':
        positionStyle = { left: '33.33%' };
        break;
      case 'right':
        positionStyle = { right: shapePositionValue };
        break;
      default:
        positionStyle = { left: 0 };
    }

    // Adjust vertical position
    positionStyle.top = shapePositionVerticalValue;

    return positionStyle;
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,
        backgroundColor: globalStyles.highContrast ? 'black' : '#4caf50',
        position: 'relative', // Ensure relative positioning for child elements
        overflow: 'hidden', // Prevent shape from overflowing the button
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showGradient && (
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
      )}
      {showGradient && shapeSource && (
        <Image
          source={shapeSource}
          style={{
            position: 'absolute',
            width: shapeWidth,
            height: shapeHeight,
            ...getShapeStyle(),
          }}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Ensure alignment with image if present
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginLeft: 20, // Adjust spacing between image and text
  },
});

export default ButtonColorHighlight;
