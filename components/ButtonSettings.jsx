import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons
import ActionPageSettings from './ActionPageSettings'; // Import the ActionPageSettings component

const ButtonSettings = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <Icon name="settings" size={24} color="black" />
        <Text style={styles.footerText}>Settings</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <ActionPageSettings onClose={toggleModal} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1, // Divide space equally
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'black', // Changed color to make the text visible
    textAlign: 'center',
    fontWeight: 'bold', // Use fontWeight instead of fontStyle for bold text
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonSettings;
