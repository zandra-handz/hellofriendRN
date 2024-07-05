import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons
import ActionPageInfo from './ActionPageInfo'; // Import the ActionPageInfo component

const ButtonInfo = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <TouchableOpacity style={styles.buttonContainer} onPress={toggleModal}>
        <Icon name="info" size={24} color="black" />
        <Text style={styles.label}>Info</Text>
      </TouchableOpacity>

      <ActionPageInfo visible={isModalVisible} onClose={toggleModal} />
    
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1, // Divide space equally
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default ButtonInfo;
