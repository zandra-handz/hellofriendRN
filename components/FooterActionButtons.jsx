import React from 'react';
import { View, StyleSheet } from 'react-native';

const FooterActionButtons = ({ buttons, height='9%', bottom=66, backgroundColor='transparent'}) => {
  return (
    <View style={[styles.buttonContainer, {height: height, bottom: bottom, backgroundColor: backgroundColor}]}>
      {buttons.map((ButtonComponent, index) => (
        <View key={index} >
          {ButtonComponent}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { 
    position: 'absolute',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between', 
  }, 
});

export default FooterActionButtons;
