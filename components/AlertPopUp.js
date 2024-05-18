import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const AlertPopUp = ({ visible, type, message, buttonText, onPress, secondButtonText, onSecondButtonPress }) => {
  const isSuccess = type === 'success';

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}></Text>
          <Text style={styles.message}>
            <Text style={styles.boldText}>{isSuccess ? 'Success! ' : 'Oops! '}</Text>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
            {secondButtonText && onSecondButtonPress && (
              <TouchableOpacity onPress={onSecondButtonPress} style={[styles.button, styles.secondButton]}>
                <Text style={styles.buttonText}>{secondButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    width: '90%',
    height: '20%',
  },
  header: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    color: 'black',
    width: '100%',
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    marginTop: 20,
    padding: 8,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
  },
  secondButton: {
    backgroundColor: '#FF6347', // Example second button color
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});

export default AlertPopUp;
