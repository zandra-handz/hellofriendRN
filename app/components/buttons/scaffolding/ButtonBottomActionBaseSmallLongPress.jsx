import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
 import { useGlobalStyle } from '@/src/context/GlobalStyleContext';   
import { useFriendList } from '@/src/context/FriendListContext';

const ButtonBottomActionBaseSmallLongPress = ({ 
  
  onPress,
  onLongPress,
  label,
  buttonPrefix='Add to',
  fontFamily='Poppins-Regular', 
  selected=false,
  width=100,
  labelFontSize = 14,     
  height,
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
        width: width,
        height: height,    
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        paddingHorizontal: '2%',
        justifyContent: 'center',
        overflow: 'hidden',     
        borderRadius: 20, 
        backgroundColor: selected ? themeAheadOfLoading.darkColor : themeAheadOfLoading.lightColor,
      }}
      onPress={onPress}  
      onLongPress={onLongPress}
    >  

       <Text
        style={[
          textStyles(labelFontSize, selected ? themeAheadOfLoading.fontColor : themeAheadOfLoading.fontColorSecondary), // White label color if disabled
          {fontWeight: selected ? 'bold': null},
        ]}
        numberOfLines={1}          
        ellipsizeMode="tail"      
      >
        {selected ? `${buttonPrefix} #` : `#`}
        {label}
        {selected ? `?` : null}
      </Text> 
    </TouchableOpacity>
  );
};

export default ButtonBottomActionBaseSmallLongPress;
