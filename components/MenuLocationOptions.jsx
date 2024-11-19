import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputUpdateLocation from './InputUpdateLocation';
import AlertSmall from '../components/AlertSmall';
import useLocationFunctions from '../hooks/useLocationFunctions';

const MenuLocationOptions = ({ onEdit, onDelete, onHelp, closeMenu }) => {
  const { selectedLocation } = useLocationFunctions();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const openEditModal = () => {
    console.log('Opening Edit Modal');
    setIsEditModalVisible(true);
  };
  
  const closeEditModal = () => {
    console.log('Closing Edit Modal');
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuContent}>
        <Text style={styles.title}>Location Options</Text>
        <TouchableOpacity
          onPress={openEditModal}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Edit Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDelete();  // Close the menu after performing the action
          }}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onHelp(); // Close the menu after performing the action
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
      <AlertSmall
        isModalVisible={isEditModalVisible}
        toggleModal={closeEditModal}
        modalContent={
          <InputUpdateLocation
            onClose={closeEditModal}
            id={selectedLocation.id}
            friends={selectedLocation.friends}
            title={selectedLocation.title}
            address={selectedLocation.address}
            notes={selectedLocation.notes}
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
          />
        }
        modalTitle={'Update Location'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  menuContent: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default MenuLocationOptions;
