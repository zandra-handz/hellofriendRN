import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

const ButtonMediumBase = ({ 
  onPress,
  label,
  height = 58,
  radius = 12, 
  backgroundColor = 'transparent', 
  fontMargin = 10, 
  showGradient = true,
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
  direction = { x: 1, y: 0 },
  showShape = true,
  shapePosition = 'left',
  shapeSource: ShapeSvg,  
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,  
  shapePositionValueVertical = null,
  labelContainerMarginHorizontal = 0,   
  shapeLabel = '',  
  shapeLabelFontSize = 16,  
  shapeLabelColor = 'black',  
  shapeLabelPositionRight = '93%'
}) => { 

  const getShapeStyle = () => {
    switch (shapePosition) {
      case 'left':
        return { left: shapePositionValue };
      case 'center':
        return { left: '33.33%' };
      case 'right':
        return { right: shapePositionValue };
      default:
        return { left: 0 };
    }
  };

 

 

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: '100%',
        height: height,
        padding: 10,
        marginBottom: 2,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden', 
        backgroundColor: showGradient ? 'transparent' : backgroundColor,
        position: 'relative',  
      }}
      onPress={onPress}
    >
      {showGradient && (
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={direction}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
      )}
      {showShape && ShapeSvg && (
        <ShapeSvg
          width={shapeWidth}
          height={shapeHeight}
          style={{
            position: 'absolute',
            ...getShapeStyle(), 
            top: shapePositionValueVertical,
          }}
        />
      )}
      {shapeLabel && (
        <Text
          style={[ 
            {
              position: 'absolute',
              top: shapePositionValueVertical ? shapePositionValueVertical + shapeHeight / 2.4 - shapeLabelFontSize / 3 : shapeHeight / 2 - shapeLabelFontSize / 2,
              left: shapePosition === 'center' ? '50%' : shapePosition === 'right' ? shapeLabelPositionRight : '10%',
              transform: [{ translateX: shapePosition === 'center' ? -shapeLabelFontSize * 2 : 0 }, { translateY: shapePositionValueVertical ? -shapeLabelFontSize / 2 : 0 }],
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
              zIndex: 1,
            },
          ]}
        >
          {shapeLabel}
        </Text>
      )}
      <View style={{ flexDirection: 'row', marginHorizontal: labelContainerMarginHorizontal, alignItems: 'center' }}>
        <Text
          style={[ 
            { fontFamily: 'Poppins-Regular', marginRight: fontMargin },
          ]}
        >
          {label}
        </Text> 
      </View>
    </TouchableOpacity>
  );
};

export default ButtonMediumBase;
