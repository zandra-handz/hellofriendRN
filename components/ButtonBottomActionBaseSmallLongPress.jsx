import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';  
import { useSelectedFriend } from '../context/SelectedFriendContext';
import AddOutlineSvg from '../assets/svgs/add-outline.svg';
import ArrowForwardDoubleSvg from '../assets/svgs/arrow-forward-double.svg';

const ButtonBottomActionBaseSmallLongPress = ({ 
  onPress,
  onLongPress,
  label,
  fontFamily='Poppins-Regular',
  height = 58,
  radius = 16,
  selected=false,
  labelFontSize = 22, 
  labelColor = 'white',
  backgroundColor = 'transparent', 
  fontMargin = 10, 
  showGradient = true, 
  direction = { x: 1, y: 0 },
  showShape = true,
  shapePosition = 'left',
  shapeSource: ShapeSvg,   
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,  
  shapePositionValueVertical = null,
  labelContainerMarginHorizontal = 0,  
  showTopLevelShape = false,  
  TopLevelShapeSvg, 
  topLevelShapeWidth = 100,
  topLevelShapeHeight = 100,
  topLevelShapePositionValue = -134,
  topLevelShapePositionValueVertical = 0,
  shapeLabel = '',  
  shapeLabelFontSize = 16, 
  shapeLabelColor = 'black', 
  shapeLabelPositionRight = '93%',
  disabled = false  
}) => { 
  const globalStyles = useGlobalStyle();   
  const { calculatedThemeColors } = useSelectedFriend();
  
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

  const getTopLevelShapeStyle = () => {
    return {
      left: topLevelShapePositionValue,
      top: topLevelShapePositionValueVertical,
    };
  };

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: 'rgba(0, 0, 0, 0.0)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    }),
  });

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: '100%',
        height: height,
        padding: 0,
        paddingHorizontal: 10,
        marginBottom: 1,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden', 
        backgroundColor: disabled ? '#A9A9A9' : showGradient ? 'transparent' : backgroundColor, // Gray background if disabled
        position: 'relative',  
      }}
      onPress={onPress}  
      onLongPress={onLongPress}
    >
      {!disabled && showGradient && (
        <>
        {!selected && ( 
        <LinearGradient
          colors={[calculatedThemeColors.lightColor, calculatedThemeColors.lightColor]}
          start={{ x: 0, y: 0 }}
          end={direction}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        )}
        {selected && (
            <LinearGradient
            colors={[calculatedThemeColors.darkColor, calculatedThemeColors.darkColor]}
            start={{ x: 0, y: 0 }}
            end={direction}
            style={{
                ...StyleSheet.absoluteFillObject,
            }}
            />
        )}
        </>
      )}
      {showShape && ShapeSvg && !disabled && (
        <ShapeSvg
          width={shapeWidth}
          height={shapeHeight}
          color={'black'}
          style={{
            position: 'absolute',
            ...getShapeStyle(), 
            top: shapePositionValueVertical,
          }}
        />
      )}
      {showShape && !ShapeSvg && !disabled && !selected && (
        <AddOutlineSvg
          width={shapeWidth}
          height={shapeHeight}
          color={'transparent'}
          style={{
            position: 'absolute',
            ...getShapeStyle(), 
            top: shapePositionValueVertical,
          }}
        />
      )}
            {showShape && !ShapeSvg && !disabled && selected  &&(
        <ArrowForwardDoubleSvg
          width={shapeWidth}
          height={shapeHeight}
          color={calculatedThemeColors.fontColor}
          style={{
            position: 'absolute',
            ...getShapeStyle(), 
            top: shapePositionValueVertical,
          }}
        />
      )}
      {showTopLevelShape && TopLevelShapeSvg && !disabled && (
        <TopLevelShapeSvg
          width={topLevelShapeWidth}
          height={topLevelShapeHeight}
          style={{
            position: 'absolute',
            ...getTopLevelShapeStyle(),
          }}
        />
      )} 
      {shapeLabel && !disabled && (
        <Text
          style={[
            textStyles(shapeLabelFontSize, shapeLabelColor),
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
          textStyles(labelFontSize, disabled ? 'white' : (selected ? calculatedThemeColors.fontColor : calculatedThemeColors.fontColorSecondary )), // White label color if disabled
          { fontFamily: selected ? 'Poppins-Bold' : fontFamily, marginRight: fontMargin },
        ]}
        numberOfLines={1}          
        ellipsizeMode="tail"      
      >
        {selected ? `Selected: ` : null}
        {label}
      </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonBottomActionBaseSmallLongPress;