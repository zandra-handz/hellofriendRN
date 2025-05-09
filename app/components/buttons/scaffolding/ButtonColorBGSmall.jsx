import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native'; 
import { useFriendList } from '@/src/context/FriendListContext';


const ButtonColorBGSmall = ({ onPress, useLightColor=true, title, textStyle, textColor }) => {
 
    const { themeAheadOfLoading } = useFriendList();
  
    return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: useLightColor ? themeAheadOfLoading.lightColor : themeAheadOfLoading.darkColor }]}>
      <Text style={[styles.buttonText, textStyle, {color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default ButtonColorBGSmall;
