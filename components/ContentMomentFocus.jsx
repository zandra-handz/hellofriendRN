// removed the onPress for right now <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useFocusEffect } from '@react-navigation/native';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import FriendSelectModalVersionButtonOnly from '../components/FriendSelectModalVersionButtonOnly';
import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';
import LoadingPage from '../components/LoadingPage';


const ContentMomentFocus = ({ placeholderText }) => {
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { handleCreateMoment, resetCreateMomentInputs, resultMessage, closeResultMessage, createMomentMutation } = useCapsuleList(); // NEED THIS TO ADD NEW 
  const { authUserState } = useAuthUser(); 
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
   
  const [textInput, setTextInput] = useState('');
  const textareaRef = useRef();   
  const [selectedCategory, setSelectedCategory] = useState('');
 

  const [showCategoriesSlider, setShowCategoriesSlider ] = useState(false);
 

  const [categoriesHeight, setCategoriesHeight] = useState(70); // Default height
 

  useFocusEffect(
    useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [loadingNewFriend])
  );


 // useFocusEffect(
   // useCallback(() => {
     // if (textareaRef.current) {
       // textareaRef.current.focus();
     // }
    //}, [createMomentMutation.isSuccess])
  //);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []); 

  const openKeyboard = () => {  
    if (textareaRef.current) { 
      textareaRef.current.focus();
    }
  }; 

  const toggleCategoriesSlider = () => {
    setShowCategoriesSlider(!showCategoriesSlider);
    if (!showCategoriesSlider) {
   Keyboard.dismiss();
   } else {
      openKeyboard();
    }
  }
 
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); 
  }; 

  const resetTextInput = () => {
    setTextInput(''); 
    setSelectedCategory(''); 
  };
   

  const handleSave = async () => { 
 
    try {
      if (selectedFriend) {
        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id,
          selectedCategory: selectedCategory,
          moment: textInput,
        };
  
        await handleCreateMoment(requestData); 
  
      }
    } catch (error) {
      console.log('catching errors elsewhere, not sure i need this', error);  
    };
  }; 

  useEffect(() => {
    if (createMomentMutation.isSuccess) { 
      resetTextInput();
      setSelectedCategory('');  
    } 

  }, [createMomentMutation.isSuccess]);
 


 

  return (
    <LinearGradient
    colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={[styles.container]} 
  >   


    
    <LoadingPage
      loading={createMomentMutation.isPending}
      resultsMessage={resultMessage}
      spinnerType='flow'
      color={'transparent'}
      labelColor={themeAheadOfLoading.fontColorSecondary}
      includeLabel={false}
      label="Saving moment..."
    />
 

 
   
 
      {closeResultMessage && ( 
      <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 30}  
       
      >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      
        <View 
        style={[styles.container]} 
      >  
      
        <View style={styles.blurView}> 
          
          <View style={styles.selectFriendContainer}>
            <FriendSelectModalVersionButtonOnly addToPress={openKeyboard} includeLabel={true} width='100%' />
          </View>
            <>  
          <TextInput
            style={[styles.modalTextInput, themeStyles.genericText, { backgroundColor: themeStyles.genericTextBackground.backgroundColor, borderColor: themeAheadOfLoading.darkColor
              
             }]}
            multiline={true}
            value={textInput}
            onFocus={() => setShowCategoriesSlider(false)}
            onChangeText={setTextInput} // Directly update textInput using setTextInput
            placeholder={placeholderText}
            //autoFocus={true}
            ref={textareaRef}
          />
          <TouchableOpacity onPress={toggleCategoriesSlider} style={{position: 'absolute', zIndex: 2, bottom: 30, right: 30}}>
            <Text style={{color: '#ccc'}}>
              CATEGORIES
            </Text>

          </TouchableOpacity>
          </> 
        </View>
        {textInput && showCategoriesSlider && selectedFriend && (
        <View style={[styles.buttonContainer, {height: categoriesHeight}]}>   
        <CardCategoriesAsButtons onCategorySelect={handleCategorySelect} momentTextForDisplay={textInput} onParentSave={handleSave}/> 
 
      </View>
       )}
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({

  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    top: 0,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectFriendContainer: { 
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    alignItems: 'center',  
    width: '100%',  
    height: 40,
  },
  blurView: {
    overflow: 'hidden',
    width: '100%',
    flex: 1,
    borderRadius: 30, 

  },
  modalTextInput: { 
    fontSize: 16, 
    color: 'white',
    alignSelf: 'center',
    padding: 24,
    textAlignVertical: 'top',
    borderWidth: 1.8,
    borderRadius: 50, 
    marginBottom: 10,
    width: '99%',  
    flex: 1,
    height: 'auto',
  },
  displayText: { 
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    padding: 10,
    textAlignVertical: 'top',
    borderWidth: 0,
    borderRadius: 20,
    width: '100%',   
    flexShrink: 1,
  },
  wordCountText: { 
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',  
    textAlign: 'right',   
  },
  displayTextContainer: {
    width: '100%', 
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'auto',
    backgroundColor: 'transparent',
    flexShrink: 1,
    height: 'auto',

  },
  buttonContainer: {
    height: '10%', 
    
    marginBottom: 0,
    width: '100%', 
  },
  categoryContainer: {  
    width: '100%',  
    flex: 1,
    height: 'auto', 
    maxHeight: '90%',
    borderRadius: 8,
    paddingTop: 10, 
  },  
  closeButton: { 
    marginTop: 14,
    borderRadius: 0, 
    padding: 4, 
    height: 'auto',  
    
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  backButton: { 
    marginTop: 0,
    borderRadius: 0, 
    padding: 4, 
    height: 'auto',  
    
    alignItems: 'center',
  },
});

export default ContentMomentFocus;
