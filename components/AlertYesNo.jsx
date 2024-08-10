import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import ButtonToggleSize from './ButtonToggleSize'; // Import your custom toggle button component
import LoadingPage from '../components/LoadingPage';

const AlertYesNo = ({
  isModalVisible,
  isFetching,
  useSpinner = false,
  toggleModal,
  headerContent,
  questionText,
  onYes,
  onNo,
  onConfirm,
  onCancel,
  onToggle, // New prop to handle toggle state changes
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  fixedHeight = false,
  height = 200, // Default height value
  type = 'success', // Can be 'success' or 'failure'
}) => {
  const [isToggledYes, setIsToggledYes] = useState(false); // Track the toggle state

  const handleToggle = () => {
    const newToggleState = !isToggledYes;
    setIsToggledYes(newToggleState);
    if (onToggle) {
      onToggle(newToggleState); // Notify parent about the toggle state change
    }
  };

  const handleConfirm = () => {
    if (isToggledYes && onYes) {
      onYes(); // Call the onYes callback
    } else if (!isToggledYes && onNo) {
      onNo(); // Call the onNo callback
    }
    if (onConfirm) {
      onConfirm(); // Call the onConfirm callback
    }
    toggleModal(); // Close the modal
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Call the onCancel callback
    }
    toggleModal(); // Close the modal
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
              <View style={styles.toggleContainer}>
                <ButtonToggleSize
                  title={isToggledYes ? 'Yes' : 'No'}
                  onPress={handleToggle}
                  iconName={isToggledYes ? 'check-circle' : 'circle-o'}
                  backgroundColor={isToggledYes ? '#4CAF50' : '#f44336'}
                  color="white"
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
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
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  toggleContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertYesNo;
