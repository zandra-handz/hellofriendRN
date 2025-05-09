import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import ButtonToggleSize from '../buttons/scaffolding/ButtonToggleSize'; // Import your custom toggle button component
import LoadingPage from '../LoadingPage';

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
  onToggle,  
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  fixedHeight = false,
  height = 200,  
}) => {
  const [isToggledYes, setIsToggledYes] = useState(false); 

  const handleToggle = () => {
    const newToggleState = !isToggledYes;
    setIsToggledYes(newToggleState);
    if (onToggle) {
      onToggle(newToggleState); 
    }
  };

  const handleConfirm = () => {
    if (isToggledYes && onYes) {
      onYes(); 
    } else if (!isToggledYes && onNo) {
      onNo();  
    }
    if (onConfirm) {
      onConfirm();  
    }
    toggleModal(); 
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();  
    }
    toggleModal();  
  };

  return (
    <Modal visible={isModalVisible} animationType="fade" transparent={false}>
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
