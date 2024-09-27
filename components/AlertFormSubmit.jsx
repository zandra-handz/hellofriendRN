import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, Animated } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LoadingPage from '../components/LoadingPage';

const AlertFormSubmit = ({
  isModalVisible, 
  headerContent,
  questionText,
  isMakingCall,
  formBody,
  formHeight=400,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Nevermind',
  showButtons = true  
}) => {
  const { themeStyles } = useGlobalStyle();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0


  const confirmColor = '#4CAF50';
  const cancelColor = 'darkgreen';

  useEffect(() => { 
    Animated.timing(fadeAnim, {
      toValue: isModalVisible ? 1 : 0,
      duration: 300,  
      useNativeDriver: true,
    }).start();
  }, [isModalVisible]);

  return (
    <Modal transparent={true} visible={isModalVisible} animationType="none">
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <View style={[styles.modalContent, themeStyles.genericTextBackground, { borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]}> 
          {headerContent && <View style={[styles.headerContainer, themeStyles.genericText]}>{headerContent}</View>}
          {questionText && <Text style={[styles.questionText, themeStyles.genericText]}>{questionText}</Text>}
          
          <View style={[styles.fullBodyContainer, {height: formHeight}]}>  
          {isMakingCall && ( 
            <LoadingPage
              loading={isMakingCall}
            />


          )}
          {!isMakingCall && ( 
          <>  
          <View style={styles.formBodyContainer}>
            {formBody}  
          </View> 

          </>
          )}
          </View>
        <View style={styles.buttonContainer}>

        {!isMakingCall && ( 
        <>
        <TouchableOpacity onPress={onCancel} style={[styles.bottomButton, {backgroundColor: cancelColor}]}>
          <Text style={styles.buttonText}>{cancelText}</Text>
        </TouchableOpacity>
        {showButtons && (
          <TouchableOpacity onPress={onConfirm} style={[styles.bottomButton, {backgroundColor: confirmColor}]}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        )}
        </>
        )}
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
    backgroundColor: 'rgba(0, 0, 0, 1)',  
  },
  modalContent: {
    width: '90%',
    padding: 10,
    borderWidth: 2, 
    borderRadius: 20,
    alignItems: 'center', 
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingTop: 10,
  },
  questionText: { 
    width: '100%',
    fontSize: 20, 
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  formBodyContainer: { 
    width: '100%',   
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',  
    height: '8%',
    alignItems: 'center',
    alignContent: 'center',
  },
  fullBodyContainer: { 
    width: '100%',  
    paddingVertical: 20,

  },
  bottomButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20, 
    marginVertical: 6,
    height: 45,
    width: '49%', 
     
  }, 
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertFormSubmit;
