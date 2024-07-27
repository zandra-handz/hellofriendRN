import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const Info = ({
  infoMessage,
  headerIcon,
  iconColor = 'blue',
  iconSize = 24,
  title = '',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="information-circle" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {headerIcon && (
              <View style={styles.headerIconContainer}>
                {headerIcon}
              </View>
            )}
            {title ? <Text style={styles.titleText}>{title}</Text> : null}
            <Text style={styles.infoText}>{infoMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.confirmButton}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  headerIconContainer: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold', // Ensure you have this font or adjust as needed
  },
  infoText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular', // Ensure you have this font or adjust as needed
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold', // Ensure you have this font or adjust as needed
  },
});

export default Info;
