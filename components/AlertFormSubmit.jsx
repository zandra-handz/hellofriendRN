import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, Animated } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const AlertFormSubmit = ({
  isModalVisible,
  toggleModal,
  headerContent,
  questionText,
  formBody,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Nevermind',
  showButtons = true // New prop to control button visibility
}) => {
  const { themeStyles } = useGlobalStyle();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0

  useEffect(() => {
    // Trigger fade-in animation when modal becomes visible
    Animated.timing(fadeAnim, {
      toValue: isModalVisible ? 1 : 0,
      duration: 300, // Duration of fade effect
      useNativeDriver: true,
    }).start();
  }, [isModalVisible]);

  return (
    <Modal transparent={true} visible={isModalVisible} animationType="none">
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <View style={[styles.modalContent, themeStyles.genericTextBackground, { borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]}> 
          {headerContent && <View style={[styles.headerContainer, themeStyles.genericText]}>{headerContent}</View>}
          {questionText && <Text style={[styles.questionText, themeStyles.genericText]}>{questionText}</Text>}
          <View style={styles.formBodyContainer}>
            {formBody}  
          </View> 
          <View style={styles.buttonContainer}>
            {showButtons && (
              <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                <Text style={styles.buttonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)', // Slightly transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',  
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
    backgroundColor: '#f44336',
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
