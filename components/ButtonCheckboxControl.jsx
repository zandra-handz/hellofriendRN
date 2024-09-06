import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonCheckboxControl = ({ 
  onToggleCheckboxes, 
  showCheckboxes 
}) => {
  const { themeStyles } = useGlobalStyle();

  return ( 
    <View style={styles.controlPanel}>
      <TouchableOpacity onPress={onToggleCheckboxes} style={[styles.controlButton, themeStyles.footerIcon]}>
        <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={20} style={themeStyles.footerIcon} />
        <Text style={[styles.controlButtonText, themeStyles.footerText]}>Hello mode?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: { 
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '6%',
    marginBottom: 10,
    borderRadius: 30,
    padding: 10,
    backgroundColor: 'transparent',
  },
  controlButton: {
    alignItems: 'flex-end',
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular', 
  },
});

export default ButtonCheckboxControl;
