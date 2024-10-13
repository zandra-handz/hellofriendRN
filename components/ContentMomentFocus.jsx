import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthUser } from '../context/AuthUserContext';

import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api'; 


import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

import LoadingPage from '../components/LoadingPage';

import ArrowRightCircleOutline from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';


const ContentMomentFocus = ({ placeholderText }) => {
  const { selectedFriend, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
  const { setCapsuleList } = useCapsuleList(); // NEED THIS TO ADD NEW 
  const { authUserState } = useAuthUser(); 

  const navigation = useNavigation();
  const [textInput, setTextInput] = useState('');
  const textareaRef = useRef(); 
  const [resetAutoFocus, setAutoFocus] = useState(false);
  const [ showCategories, setShowCategories ] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('');

  const [ saveInProgress, setSaveInProgress ] = useState(false);
  const [ resultMessage, setResultMessage ] = useState(null);
  const [gettingResultMessage, setGettingResultMessage ] = useState(null);
  
  const [clearText, setClearText] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);  
  const delayForResultsMessage = 1000;

 

  const handleTextUpdate = (momentText) => {
    setTextInput(momentText);

  }; 

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); 
  };

  const resetTextInput = () => {
    setTextInput(''); 
    setSelectedCategory('');
    setShowCategories(false);
  };
  

  const toggleCategoryView = () => {
    setShowCategories(prev => !prev);
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
          <View style={styles.selectFriendContainer}>
            <FriendSelectModalVersion width='100%' />
          </View>
          {showCategories && (
            <>
      <View style={styles.displayTextContainer}>
        <Text
          style={[styles.displayText, { borderColor: calculatedThemeColors.darkColor, color: calculatedThemeColors.fontColor }]}
          numberOfLines={4} // Set this to the number of lines you want to allow
          ellipsizeMode="tail" // This will add ellipses at the end if text is too long
        >
          
          {textInput} 
        </Text>

      </View>
        <TouchableOpacity
          onPress={toggleCategoryView}
          style={[styles.backButton, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }]}
        >
          <View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>
          <ArrowLeftCircleOutline height={34} width={34} color={calculatedThemeColors.fontColor} />

          <Text style={[styles.closeButtonText, { paddingLeft: 10, color: calculatedThemeColors.fontColor }]}>
            Edit moment
          </Text>
          </View>
          <Text
          style={[styles.closeButtonText, { borderColor: 'transparent', color: calculatedThemeColors.fontColor }]}
          numberOfLines={1} // Set this to the number of lines you want to allow
          ellipsizeMode="tail" // This will add ellipses at the end if text is too long
        >
          
          ({textInput.length}/3000) 
        </Text>
          
        </TouchableOpacity>
        </>
         )}
          {!showCategories && ( 
          <TextInput
            style={[styles.modalTextInput, { borderColor: calculatedThemeColors.darkColor, color: calculatedThemeColors.fontColor }]}
            multiline={true}
            value={textInput}
            onChangeText={setTextInput} // Directly update textInput using setTextInput
            placeholder={placeholderText}
            autoFocus={true}
            ref={textareaRef}
          />
      )}
            {showCategories && selectedFriend && (
        <View style={styles.categoryContainer}>
        <> 
        <CardCategoriesAsButtons onCategorySelect={handleCategorySelect} momentTextForDisplay={textInput} onParentSave={handleSave}/> 
           
        </> 
      </View>

      )}
        </BlurView>
        <View style={styles.buttonContainer}>  
        {textInput && !loadingNewFriend && selectedFriend && !showCategories && (
        <TouchableOpacity
          onPress={toggleCategoryView}
          style={[styles.closeButton, { flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: calculatedThemeColors.darkColor }]}
        >
          <Text style={[styles.closeButtonText, { paddingRight: 10, color: calculatedThemeColors.fontColor }]}>
            Pick category
          </Text>
          <ArrowRightCircleOutline height={34} width={34} color={calculatedThemeColors.fontColor} />

        </TouchableOpacity>
         )}

        {!textInput && (
        <TouchableOpacity
        onPress={() => {}}
        style={[styles.closeButton, { flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: calculatedThemeColors.darkColor }]}
      >
        <Text style={[styles.closeButtonText, { paddingRight: 10, color: calculatedThemeColors.darkColor }]}>
          Pick category
        </Text>
        <ArrowRightCircleOutline height={34} width={34} color={calculatedThemeColors.darkColor} />

      </TouchableOpacity>
         )}

      </View>
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
    justifyContent: 'flex-end',
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
  },
  blurView: {
    overflow: 'hidden',
    width: '100%',
    flex: 1,
    borderRadius: 0, 

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
    heigght: 'auto',
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
    marginTop: 20,
    borderRadius: 0, 
    padding: 4, 
    height: 'auto',  
    
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  closeButton: { 
    marginTop: 20,
    borderRadius: 0, 
    padding: 4, 
    height: 'auto',  
    
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
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
