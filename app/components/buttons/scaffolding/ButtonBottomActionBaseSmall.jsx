import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';  
import { useFriendList } from '@/src/context/FriendListContext';
import AddOutlineSvg from '@/app/assets/svgs/add-outline.svg';

const ButtonBottomActionBaseSmall = ({ 
  onPress,
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
  const { themeAheadOfLoading } = useFriendList();
  
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
      onPress={!disabled ? onPress : null}  
    >
      {!disabled && showGradient && (
        <>
        {!selected && ( 
        <LinearGradient
          colors={[themeAheadOfLoading.lightColor, themeAheadOfLoading.lightColor]}
          start={{ x: 0, y: 0 }}
          end={direction}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        )}
        {selected && (
            <LinearGradient
            colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.darkColor]}
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
          color={themeAheadOfLoading.fontColorSecondary}
          style={{
            position: 'absolute',
            ...getShapeStyle(), 
            top: shapePositionValueVertical,
          }}
        />
      )}
            {showShape && !ShapeSvg && !disabled && selected  &&(
        <AddOutlineSvg
          width={shapeWidth}
          height={shapeHeight}
          color={themeAheadOfLoading.fontColor}
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
          textStyles(labelFontSize, disabled ? 'white' : (selected ? themeAheadOfLoading.fontColor : calculatedThemeColors.fontColorSecondary )), // White label color if disabled
          { fontFamily: fontFamily, marginRight: fontMargin },
        ]}
        numberOfLines={1}          
        ellipsizeMode="tail"      
      >
        {label}
      </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonBottomActionBaseSmall;
