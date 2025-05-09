import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; // Import the global style context

const SignInButton = ({
  onPress,
  title,
  showGradient = true, 
  shapeSource,
  shapeWidth = 260,
  shapeHeight = 260,
  shapePosition = 'left',
  shapePositionValue = -134, // Default shape position value
  shapePositionVerticalValue = 0, // Default vertical position of the shape
}) => {
  const globalStyles = useGlobalStyle(); // Get the global styles
  const { themeStyles } = useGlobalStyle();
  const { manualGradientColors } = useGlobalStyle();

 

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
        backgroundColor: '#ebebeb', //'#e0e0e0', 
        overflow: 'hidden', // Prevent shape from overflowing the button
      }}
      onPress={onPress}
      activeOpacity={0.8}
    > 
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
      <Text style={[styles.buttonText, {color: themeStyles.genericText }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 30,
    paddingVertical: '3%', 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Ensure alignment with image if present 
    backgroundColor: 'orange',
  
  },
  buttonText: {  
    fontFamily: 'Poppins-Bold', 
    fontSize: 14,
    
  },
});

export default SignInButton;
