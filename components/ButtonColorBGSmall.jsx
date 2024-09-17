import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonColorBGSmall = ({ onPress, useLightColor=true, title, textStyle }) => {

    const { calculatedThemeColors } = useSelectedFriend();
  
    return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: useLightColor ? calculatedThemeColors.lightColor : calculatedThemeColors.darkColor }]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
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
