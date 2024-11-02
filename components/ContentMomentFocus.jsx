// removed the onPress for right now <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api'; 
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import FriendSelectModalVersionButtonOnly from '../components/FriendSelectModalVersionButtonOnly';
import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';
import LoadingPage from '../components/LoadingPage';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';


const ContentMomentFocus = ({ placeholderText }) => {
  const { selectedFriend, friendColorTheme, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
  const { setCapsuleList } = useCapsuleList(); // NEED THIS TO ADD NEW 
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
  const [isSuccess, setIsSuccess] = useState(true);  
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
    setSaveInProgress(true); 
    setGettingResultMessage(true);
    try {
      if (selectedFriend) {
        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id,
          typed_category: selectedCategory,
          capsule: textInput,
        };
  
        const response = await saveThoughtCapsule(requestData);
  
        const newCapsule = {
          id: response.id,
          typedCategory: response.typed_category,
          capsule: response.capsule,
          created: response.created_on,
          
        };
   
        setCapsuleList(prevCapsules => [newCapsule, ...prevCapsules]);
        
        resetTextInput();
        setSelectedCategory(''); 

        setResultMessage('Moment saved!');
        setGettingResultMessage(true);
        setIsSuccess(true); 
        let timeout;
        // Set a timeout to turn gettingResultsMessage to false after 3 seconds
        timeout = setTimeout(() => {
          setGettingResultMessage(false);
        }, delayForResultsMessage);  
        return () => clearTimeout(timeout);
        
      }
    } catch (error) {
      setResultMessage('Error! Could not save moment');
      setGettingResultMessage(true);
      let timeout;
  
      timeout = setTimeout(() => {
        setGettingResultMessage(false);
      }, delayForResultsMessage);  
      return () => clearTimeout(timeout);
    } finally {
      setSaveInProgress(false);  
      setClearText(true);
      
 
    }
  }; 

  return (
    <View style={styles.container}>
              {gettingResultMessage && (
          <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={saveInProgress}
            resultsMessage={resultMessage}
            spinnnerType='wander'
            includeLabel={true}
            label="Saving moment..."
          />
          </View>
        )}
      {!gettingResultMessage && ( 
      <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 30}  
       
      >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      
        <LinearGradient
        colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}  
        style={[styles.container]} 
      >  
        <View 
          

          style={styles.blurView}> 
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
      </LinearGradient>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </>
      )}
    </View>
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
