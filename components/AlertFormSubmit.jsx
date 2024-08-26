import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';


const AlertFormSubmit = ({
  isModalVisible,
  toggleModal,
  headerContent,
  questionText,
  formBody,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Nevermind'
}) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}> 
          {headerContent && <View style={styles.headerContainer}>{headerContent}</View>}
          {questionText && <Text style={styles.questionText}>{questionText}</Text>}
          <View style={styles.formBodyContainer}> 
            {formBody}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  formBodyContainer: { 
    width: '100%',  
    marginBottom: 10,
    position: 'relative',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%', 
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20, 
    marginVertical: 6,
    width: '100%', 
  },
  cancelButton: {
    backgroundColor: 'green',
    width: '100%',
    borderRadius: 20, 
    padding: 10, 
    marginVertical: 6, 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',

  },
});

export default AlertFormSubmit;
