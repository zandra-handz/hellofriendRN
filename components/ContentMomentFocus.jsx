// removed the onPress for right now <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import FriendSelectModalVersionButtonOnly from '../components/FriendSelectModalVersionButtonOnly';
import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';
import LoadingPage from '../components/LoadingPage';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';


const ContentMomentFocus = ({ placeholderText }) => {
  const { selectedFriend, friendColorTheme, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
  const { handleCreateMoment, createMomentMutation } = useCapsuleList(); // NEED THIS TO ADD NEW 
  const { authUserState } = useAuthUser(); 
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
   
  const [textInput, setTextInput] = useState('');
  const textareaRef = useRef();  
  const [ showCategories, setShowCategories ] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('');

  const [ saveInProgress, setSaveInProgress ] = useState(false);
  const [ resultMessage, setResultMessage ] = useState(null);
  const [gettingResultMessage, setGettingResultMessage ] = useState(null);
   

  const [showCategoriesSlider, setShowCategoriesSlider ] = useState(false);

  const [clearText, setClearText] = useState(false); 
  const delayForResultsMessage = 1000;

  const [categoriesHeight, setCategoriesHeight] = useState(70); // Default height
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

 // useEffect(() => {
  //  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
  //    setIsKeyboardVisible(true);
  //    setCategoriesHeight(70); // Adjust this value as needed when keyboard is visible
  //  });

   // const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
   //   setIsKeyboardVisible(false);
   //   setCategoriesHeight('50%'); // Reset height when keyboard is hidden
   // });

    // Cleanup listeners on unmount
  //  return () => {
  //    keyboardDidShowListener.remove();
  //    keyboardDidHideListener.remove();
  //  };
 // }, []);

  useFocusEffect(
    useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [loadingNewFriend])
  );


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []); 

  const openKeyboard = () => { 
    console.log('RUNNNNNNNNNNNNNNNNNNING');
    if (textareaRef.current) {
      console.log('AAHHHHH');
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
  

  const toggleCategoryView = () => { 
    console.log(showCategories);

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
      setResultMessage('Added!'); 

      let timeout;

      timeout = setTimeout(() => {
         
        setSaveInProgress(false);
      }, 1000);

      resetTextInput();
      setSelectedCategory(''); 
      createMomentMutation.reset();
    }

  }, [createMomentMutation.isSuccess]);

  useEffect(() => {


    if (createMomentMutation.isLoading) { 

      setSaveInProgress(true); 
      console.log('saving'); 
    } else {
      setSaveInProgress(false); 
    }

  }, [createMomentMutation.isLoading]);



  useEffect(() => {

    if (createMomentMutation.isError) {
      console.log('MUTATION IS ERROR');
      
      setResultMessage('Something went wrong :( Please try again');
  
      let timeout;
  
        timeout = setTimeout(() => { 
          
        setSaveInProgress(false);
        createMomentMutation.reset();
        setResultMessage(null); 
      }, 1000);
    }
  
  }, [createMomentMutation.isError]);

  return (
    <LinearGradient
    colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={[styles.container]} 
  >   


    
    <LoadingPage
      loading={saveInProgress}
      resultsMessage={resultMessage}
      spinnnerType='wander'
      includeLabel={true}
      label="Saving moment..."
    />
 

 
   
 
      {(createMomentMutation.isIdle) && ( 
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
            style={[styles.modalTextInput, themeStyles.genericText, { backgroundColor: themeStyles.genericTextBackground.backgroundColor, borderColor: loadingNewFriend? 'transparent' : calculatedThemeColors.darkColor
              
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
