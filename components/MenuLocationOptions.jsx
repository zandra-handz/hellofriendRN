// MiniMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuLocationOptions = ({ onEdit, onDelete, onHelp, closeMenu }) => (
  <View style={styles.menuContainer}>
    <TouchableOpacity
      onPress={() => {
        onEdit();
        closeMenu(); // Close the menu after performing the action
      }}
      style={styles.menuItem}
    >
      <Text style={styles.menuItemText}>Edit Location</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        onDelete();
        closeMenu(); // Close the menu after performing the action
      }}
      style={styles.menuItem}
    >
      <Text style={styles.menuItemText}>Delete</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        onHelp();
        closeMenu(); // Close the menu after performing the action
      }}
      style={styles.menuItem}
    >
      <Text style={styles.menuItemText}>Help</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={closeMenu} // Close the menu without performing any action
      style={styles.menuItem}
    >
      <Text style={styles.menuItemText}>Close</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },
});

export default MenuLocationOptions;
