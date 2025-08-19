import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, Animated, Pressable } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 
import { useFriendStyle } from '@/src/context/FriendStyleContext';
import ButtonBottomSaveMoment from '../buttons/moments/ButtonBottomSaveMoment';

const AlertFormSubmit = ({
  isModalVisible, 
  headerContent,
  questionText,
  questionIsSubTitle=true,
  isMakingCall,
  formBody,
  formHeight=400,
  onConfirm,
  onCancel,
  saveMoment=false,
  useSvgForCancelInstead, 
  confirmText = 'OK',
  cancelText = 'Nevermind',
  showButtons = true  
}) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();
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
          {saveMoment && (
            <>
            {!useSvgForCancelInstead && ( 
            <TouchableOpacity onPress={onCancel} style={[styles.topButton, {position: 'absolute', zIndex: 1, top: 4, left: 4, backgroundColor: themeAheadOfLoading.lightColor}]}>
              <Text style={[styles.buttonText]}>{cancelText}</Text>
            </TouchableOpacity>
            )}  
            {useSvgForCancelInstead && ( 
            <TouchableOpacity onPress={onCancel} style={[styles.topButton, {position: 'absolute', zIndex: 1, top: 4, left: 4}]}>
              <Text style={themeStyles.genericText}>{useSvgForCancelInstead}</Text>
            </TouchableOpacity>
            )} 
            </>

            )}
          {questionText && 
          
          <View style={ questionIsSubTitle ? styles.questionIsSubTitleContainer : styles.questionContainer}>
          <Text style={[ ( questionIsSubTitle? styles.questionIsSubTitleText : styles.questionText), themeStyles.genericText]}
                numberOfLines={1} ellipsizeMode='tail'>{questionText}</Text>
          </View>
          }  
          <View style={[styles.fullBodyContainer, {height: formHeight}]}>  
  
          <>  
          <View style={styles.formBodyContainer}>
            {formBody}  
          </View> 

          </> 
          </View>
        <View style={styles.buttonContainer}>

        {!isMakingCall && ( 
        <>
        {!saveMoment && ( 
        <TouchableOpacity onPress={onCancel} style={[styles.bottomButton, {backgroundColor: themeAheadOfLoading.lightColor}]}>
          <Text style={[styles.buttonText, {color: themeAheadOfLoading.fontColorSecondary}]}>{cancelText}</Text>
        </TouchableOpacity>
        )}


        {showButtons && (
          <>
          {!saveMoment && (  
          <TouchableOpacity onPress={onConfirm} style={[styles.bottomButton, {backgroundColor: themeAheadOfLoading.darkColor}]}>
            <Text style={[styles.buttonText, {color: themeAheadOfLoading.fontColor}]}>{confirmText}</Text>
          </TouchableOpacity>
           )}
           
           {saveMoment && (
            <Pressable onPress={onConfirm} style={{width: '100%', height: 40, backgroundColor: 'red'}}/>
 
           )}
           </>
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
    zIndex: 10,
  },
  modalContent: {
    width: '90%',
    padding: 10,
    borderWidth: 2, 
    borderRadius: 20,
    alignItems: 'center', 
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerContainer: {
    paddingTop: 10,
  },
  questionIsSubTitleContainer: { 
    paddingTop: 10,
    width: '100%',  
    justifyContent: 'center',  
    flexWrap: 'wrap', 
  },
  questionContainer: { 
    paddingTop: 10,
    width: '100%',  
    justifyContent: 'center',  
    flexWrap: 'wrap',
    height: 'auto',  
  },
  questionIsSubTitleText: {
    width: '100%',
    fontSize: 20, 
    textAlign: 'center',  
    fontFamily: 'Poppins-Regular',
         
    overflow: 'hidden',    
  },
  questionText: { 
    width: '100%',
    fontSize: 20, 
    textAlign: 'left',  // Change to 'left' for a left-aligned wrap
    fontFamily: 'Poppins-Regular',
    flexShrink: 1,    
    height: 300,   // Allow text to shrink if needed
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
    paddingBottom: 20,

  },
  bottomButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20, 
    marginVertical: 6,
    height: 45,
    width: '49%', 
     
  }, 
  topButton: { 
    padding: 10,
    borderRadius: 20, 
    paddingVertical: 2, 

     
  }, 
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default AlertFormSubmit;
