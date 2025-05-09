import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const ButtonControlPanel = ({ 
  onCollapseAll, 
  onSwitchView, 
  onToggleCheckboxes, 
  showCheckboxes,
  showSVG // true for shapes, false for words
}) => {

  const { themeStyles } = useGlobalStyle();

  return ( 
    <View 
    style={[
    styles.controlPanel 
    ]}
>
      <TouchableOpacity onPress={onCollapseAll} style={[styles.controlButton, themeStyles.footerIcon]}>
        <Icon name="compress" size={20} style={themeStyles.footerIcon} />
        <Text style={[styles.controlButtonText, themeStyles.footerText]}>Collapse All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchView} style={[styles.controlButton, themeStyles.footerIcon]}>
        <Icon name={showSVG ? "object-group" : "font"} size={20}  style={themeStyles.footerIcon}/>
        <Text style={[styles.controlButtonText, themeStyles.footerText]}>Switch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleCheckboxes} style={[styles.controlButton, themeStyles.footerIcon]}>
        <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={20}  style={themeStyles.footerIcon} />
        <Text style={[styles.controlButtonText, themeStyles.footerText]}>Checkboxes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderRadius: 30,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular', 
  },
});

export default ButtonControlPanel;
