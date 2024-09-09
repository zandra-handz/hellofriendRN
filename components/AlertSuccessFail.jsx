import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import LoadingPage from '../components/LoadingPage';

const AlertSuccessFail = ({
  isVisible,
  message,
  onClose,
  tryAgain = true,
  onRetry,
  autoClose = false,
  saveStatus,
  isFetching = false,  // New prop for spinner/loading state
  timeToAutoClose = 3000,
  type = 'success',  // Can be 'success', 'failure', 'saving', or 'both'
  spinnerType = 'circle',
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (autoClose && isVisible && type === 'saving') {
      const timer = setTimeout(() => {
        handleClose();
      }, timeToAutoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, timeToAutoClose, type]);

  const handleClose = () => {
    if (type === 'saving') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out duration
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(1); // Reset fadeAnim value after the fade out
        onClose(); // Call onClose after fade out completes
      });
    } else {
      onClose(); // Immediately close the modal without animation
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} animationType="none" transparent={true}>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, type === 'saving' && { opacity: fadeAnim }]}>
          
          {type === 'saving' && (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Please wait</Text>
              </View>
              <View style={{ flex: 1, maxHeight: 100, paddingBottom: 20 }}>
                <LoadingPage loading={saveStatus} spinnerType={spinnerType} />
              </View>
              <View style={styles.bottomSpacerContainer}></View>
            </>
          )}

          {type === 'success' && (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Success</Text>
              </View>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.successButton}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {type === 'failure' && (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Error</Text>
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

          {type === 'both' && (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}></Text>
              </View>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                {isFetching && (
                  <LoadingPage loading={isFetching} spinnerType={spinnerType} />
                )}
                {tryAgain && onRetry && (
                  <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                    <Text style={styles.buttonText}>Try Again</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose} style={styles.successButton}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
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
    minHeight: 224,
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
  bottomSpacerContainer: {
    width: '100%',
    marginTop: 20,
  },
  successButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  failureButton: {
    backgroundColor: '#f44336',
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
    backgroundColor: '#f44336',
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
