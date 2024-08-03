import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const AlertSuccessFail = ({
  isVisible,
  message,
  onClose,
  tryAgain = true,
  onRetry,
  isFetching = false,
  autoClose = false,
  timeToAutoClose = 3000, // Default to 3 seconds
  type = 'success' // Can be 'success' or 'failure'
}) => {
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, timeToAutoClose);
      return () => clearTimeout(timer); // Clean up timer on component unmount
    }
  }, [autoClose, isVisible, timeToAutoClose, onClose]);

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        {type === 'success' && (
            <> 
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    Success
                </Text> 
            </View>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={type === 'success' ? styles.successButton : styles.failureButton}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
            </>
        )} 
        {type === 'failure' && (
            <> 
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    Error
                </Text> 
            </View>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                {tryAgain && onRetry && (
                    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                  )}
                <TouchableOpacity onPress={onClose} style={styles.failureButton}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
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
    position: 'relative',
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50', // Green background for success
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  failureButton: {
    backgroundColor: '#f44336', // Red background for failure
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  retryButton: {
    backgroundColor: '#f44336', // Red background for failure
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertSuccessFail;
