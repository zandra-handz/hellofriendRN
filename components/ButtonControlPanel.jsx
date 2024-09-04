import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ButtonControlPanel = ({ 
  onCollapseAll, 
  onSwitchView, 
  onToggleCheckboxes, 
  showCheckboxes,
  showSVG // true for shapes, false for words
}) => {
  return (
    <View style={styles.controlPanel}>
      <TouchableOpacity onPress={onCollapseAll} style={styles.controlButton}>
        <Icon name="compress" size={24} color="black" />
        <Text style={styles.controlButtonText}>Collapse All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchView} style={styles.controlButton}>
        <Icon name={showSVG ? "object-group" : "font"} size={24} color="black" />
        <Text style={styles.controlButtonText}>Switch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleCheckboxes} style={styles.controlButton}>
        <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={24} color="black" />
        <Text style={styles.controlButtonText}>Checkboxes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ButtonControlPanel;
