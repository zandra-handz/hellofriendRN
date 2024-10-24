import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Text, Animated } from 'react-native';
import { useGlobalStyle} from '../context/GlobalStyleContext';

import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const AlertFormNoSubmit = ({
  isModalVisible, 
  headerContent,
  questionText,
  formBody,
  formHeight = 400,
  onCancel,
  cancelText = 'Done', // Default button text set to 'Done'
}) => {
  const { themeStyles } = useGlobalStyle(); 
  const { calculatedThemeColors } = useSelectedFriend();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0

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
            <View style={styles.formBodyContainer}>
              {formBody}  
            </View> 
          </View>

          <View style={styles.buttonContainer}>
            
            <ButtonBaseSpecialSave 
            label='BACK TO APP'
            image={require("../assets/shapes/redheadcoffee.png")}
            imageSize={100}
            labelSize={19}
            isDisabled={false}
            imagePositionHorizontal={0} 
            imagePositionVertical={12}
            borderRadius={50}
            onPress={onCancel}
            /> 
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
      backgroundColor: 'rgba(0, 0, 0, 0.84)',  // Slightly transparent background
    },
    modalContent: {
      width: '94%',  // Fixed width of 80% of the screen
      minHeight: 200,  // Minimum height to prevent collapse
      padding: 10,
      borderWidth: 2,
      borderRadius: 20,
      alignItems: 'center',
      backgroundColor: 'white',  // Ensure it's visible
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
      justifyContent: 'center',
      width: '100%',  
      height: '8%',
      alignItems: 'center',
    },
    fullBodyContainer: { 
      width: '100%',  
      paddingVertical: 20,
    },
    bottomButton: { 
      padding: 10,
      borderRadius: 12, 
      marginVertical: 0,
      height: 45,
      width: '100%', 
    }, 
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Poppins-Bold',
    }, 
  
});

export default AlertFormNoSubmit;
