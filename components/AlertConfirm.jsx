import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import LoadingPage from '../components/LoadingPage';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const AlertConfirm = ({
  isModalVisible,
  isFetching,
  useSpinner = false,
  headerContent,
  questionText,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Nevermind',
  fixedHeight = false,
  height = 200, // Default height value
  type = 'success', // Can be 'success' or 'failure'
}) => {
  const { themeStyles } = useGlobalStyle();

  return (
    <Modal visible={isModalVisible} animationType="fade" transparent={false}>
      <View style={[styles.modalContainer, themeStyles.genericTextBackground]}>
        <View style={[styles.modalContent, fixedHeight && { height }]}> 
          {headerContent && <View style={[styles.headerContainer, {color: themeStyles.genericText.color}]}>{headerContent}</View>}
          {useSpinner && isFetching ? (
            <LoadingPage loading={isFetching} spinnerType='circle' />
          ) : (
            <View style={styles.contentContainer}>
              {questionText && <Text style={[styles.questionText, themeStyles.genericText]}>{questionText}</Text>}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
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
    zIndex: 4,
  },
  modalContent: {
    width: '80%',
    padding: 10, 
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 4,
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
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '100%', // Full width
    alignItems: 'center', // Center text inside button
  },
  cancelButton: {
    backgroundColor: 'green', // Default cancel color
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: '100%', // Full width
    alignItems: 'center', // Center text inside button
  },
  successCancelButton: {
    backgroundColor: '#388E3C', // Dark green for success type
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertConfirm;
