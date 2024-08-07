import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, TextInput } from 'react-native';
import LoadingPage from '../components/LoadingPage';

const AlertSingleInput = ({
  isModalVisible,
  isFetching,
  useSpinner = false,
  toggleModal,
  headerContent,
  questionText,
  onConfirm,
  onCancel,
  onInputChange,
  confirmText = 'OK',
  cancelText = 'Nevermind',
  fixedHeight = false,
  height = 200, // Default height value
  type = 'success', // Can be 'success' or 'failure'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(inputValue); // Pass the input value to the parent
    }
    toggleModal(); // Close the modal
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    if (onInputChange) {
      onInputChange(value); // Notify parent about the input change
    }
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, fixedHeight && { height }]}>
          {headerContent && <View style={styles.headerContainer}>{headerContent}</View>}
          {useSpinner && isFetching ? (
            <LoadingPage loading={isFetching} spinnerType='circle' />
          ) : (
            <View style={styles.contentContainer}>
              {questionText && <Text style={styles.questionText}>{questionText}</Text>}
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={handleInputChange}
                placeholder="Type here..."
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCancel} style={[styles.cancelButton, type === 'success' && styles.successCancelButton]}>
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  successCancelButton: {
    backgroundColor: '#388E3C',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertSingleInput;
