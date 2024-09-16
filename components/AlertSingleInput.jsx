import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoadingPage from '../components/LoadingPage';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const AlertSingleInput = ({
  isModalVisible,
  autoFocus = true,
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
  height = 200,
  type = 'success',
  maxLength = 100,
}) => {
  const { themeStyles } = useGlobalStyle();
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalVisible && autoFocus) { 
      
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);  //might be risking the keyboard opening too early (=not seeming to open at all) with this small of a delay?
    }
  }, [isModalVisible, autoFocus]);

  const handleConfirm = () => { 
    if ((inputValue.length <= maxLength) && onConfirm) {
      onConfirm(inputValue);
    }
    toggleModal();
  };

  const handleInputChange = (value) => {
    setInputValue(value); 
    if (onInputChange) {
      onInputChange(value);
    }
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, themeStyles.genericTextBackgroundShadeTwo, fixedHeight && { height }]}>
            {headerContent && <View style={styles.headerContainer}>{headerContent}</View>}
            {useSpinner && isFetching ? (
              <LoadingPage loading={isFetching} spinnerType='circle' />
            ) : (
              <View style={styles.contentContainer}>
                {questionText && <Text style={[styles.questionText, themeStyles.genericText]}>{questionText}</Text>}
                <TextInput
                  ref={inputRef}
                  style={[styles.input, themeStyles.input]}
                  value={inputValue}
                  onChangeText={handleInputChange}
                  placeholder="Type here..."
                  maxLength={maxLength}
                  onSubmitEditing={handleConfirm}
                /> 
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    style={[styles.confirmButton, !inputValue && styles.buttonDisabled]}
                    disabled={!inputValue}
                  >
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
      </TouchableWithoutFeedback>
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
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
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
  buttonDisabled: {
    backgroundColor: 'darkgray', // Gray color for disabled state
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
  buttonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertSingleInput;
