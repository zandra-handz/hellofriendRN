import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertFullSize = ({ visible, type, message, buttonText, onPress, secondButtonText, onSecondButtonPress }) => {
  if (!visible) return null; // Do not render if not visible

  const isSuccess = type === 'success';

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
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
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    alignItems: 'center',
  },
  secondButton: {
    backgroundColor: '#FF6347', // Example second button color
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default AlertFullSize;
