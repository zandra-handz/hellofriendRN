import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';

const ContentMomentFocus = ({ placeholderText }) => {
  const { calculatedThemeColors } = useSelectedFriend();
  const navigation = useNavigation();
  const [textInput, setTextInput] = useState('');
  const textareaRef = useRef();
  const [resetAutoFocus, setAutoFocus] = useState(false);

  // Function to handle navigation to 'AddMoment' screen, passing textInput value
  const handleGoToMomentScreen = () => {
    navigation.navigate('AddMoment', { momentText: textInput, handleTextUpdate: handleTextUpdate });
  };

  const handleTextUpdate = (momentText) => {
    setTextInput(momentText);

  }; 

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 40}  
      >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      
      <LinearGradient
        colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <BlurView 
          intensity={50} 
          

          style={styles.blurView}>
        <TextInput
          style={[styles.modalTextInput, { borderColor: calculatedThemeColors.darkColor }]}
          multiline={true}
          value={textInput}
          onChangeText={setTextInput} // Directly update textInput using setTextInput
          placeholder={placeholderText}
          autoFocus={true}
          ref={textareaRef}
        />
        </BlurView>
        <View style={styles.buttonContainer}>  
        {textInput && (
        <TouchableOpacity
          onPress={handleGoToMomentScreen}
          style={[styles.closeButton, { backgroundColor: calculatedThemeColors.darkColor }]}
        >
          <Text style={[styles.closeButtonText, { color: calculatedThemeColors.lightColor }]}>
            Done
          </Text>

        </TouchableOpacity>
         )}
        {!textInput && (
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.closeButton, { backgroundColor: calculatedThemeColors.darkColor }]}
        >
          <Text style={[styles.closeButtonText, { color: calculatedThemeColors.lightColor }]}>
            Done
          </Text>

        </TouchableOpacity>
         )}
      </View>
      </LinearGradient>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  blurView: {
    overflow: 'hidden',
    width: '100%',
    flex: 1,
    borderRadius: 20, 

  },
  modalTextInput: { 
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    padding: 24,
    textAlignVertical: 'top',
    borderWidth: 1.8,
    borderRadius: 20,
    width: '100%',  
    flex: 1,
    height: 'auto',
  },
  buttonContainer: {
    heigght: 'auto',
    width: '100%', 
  },
  closeButton: { 
    marginTop: 20,
    borderRadius: 0, 
    padding: 6, 
    height: 'auto',  
    
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default ContentMomentFocus;
