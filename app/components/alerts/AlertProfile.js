import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const AlertProfile = ({ visible, profileData, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} presentationStyle="overFullScreen">
      
      <View style={styles.overlay}>
        <View style={styles.container}> 
          <Text>Name: {profileData.name}</Text>
          <Text>Email: {profileData.email}</Text> 
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start', // Align pop-up at the top
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 8,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});

export default AlertProfile;
