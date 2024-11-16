import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
 import { useGlobalStyle } from '../context/GlobalStyleContext';  
 import ArrowForwardDoubleSvg from '../assets/svgs/arrow-forward-double.svg';
import { useFriendList } from '../context/FriendListContext';

const ButtonBottomActionBaseSmallLongPress = ({ 
  onPress,
  onLongPress,
  label,
  fontFamily='Poppins-Regular', 
  selected=false,
  labelFontSize = 14,    
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,  
  shapePositionValueVertical = null, 
}) => { 
  const globalStyles = useGlobalStyle();   
  const { themeAheadOfLoading } = useFriendList();
 
 
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
        width: 'auto',
        height: '100%',    
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 10,
        justifyContent: 'center',
        overflow: 'hidden',     
        borderRadius: 10, 
        backgroundColor: selected ? themeAheadOfLoading.darkColor : themeAheadOfLoading.lightColor,
      }}
      onPress={onPress}  
      onLongPress={onLongPress}
    > 
        <>  
        </> 
        {selected && (
        <ArrowForwardDoubleSvg
          width={shapeWidth}
          height={shapeHeight}
          color={'transparent'}
          style={{
            position: 'absolute', 
            right: shapePositionValue,
            top: shapePositionValueVertical,
          }}
        />
      )} 

       <Text
        style={[
          textStyles(labelFontSize, selected ? themeAheadOfLoading.fontColor : themeAheadOfLoading.fontColorSecondary), // White label color if disabled
          { fontFamily: selected ? 'Poppins-Bold' : fontFamily },
        ]}
        numberOfLines={1}          
        ellipsizeMode="tail"      
      >
        {selected ? `Add to #` : `#`}
        {label}
        {selected ? `?` : null}
      </Text> 
    </TouchableOpacity>
  );
};

export default ButtonBottomActionBaseSmallLongPress;
