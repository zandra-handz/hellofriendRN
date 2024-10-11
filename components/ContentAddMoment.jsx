import React, { useState  } from 'react';
import { View, StyleSheet } from 'react-native';

import EnterMoment from '../components/EnterMoment'; 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import { useAuthUser } from '../context/AuthUserContext';

import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api'; 

import HelloFriendFooter from '../components/HelloFriendFooter';

import  { useGlobalStyle } from '../context/GlobalStyleContext';

import LoadingPage from '../components/LoadingPage';
import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

import ButtonBottomSaveMoment from '../components/ButtonBottomSaveMoment';

const ContentAddMoment = ( {friendFixed=false, momentText, updateTextInFocusScreen}) => {
  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { setCapsuleList } = useCapsuleList(); // NEED THIS TO ADD NEW 
  
  const [ momentEditMode, setMomentEditMode] = useState(false); 
  const [textInput, setTextInput] = useState(momentText);

  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [userEntryCapsule, setUserEntryCapsule] = useState(momentText); 
  const [ saveInProgress, setSaveInProgress ] = useState(false);
  const [ resultMessage, setResultMessage ] = useState(null);
  const [gettingResultMessage, setGettingResultMessage ] = useState(null);
  
  const [clearText, setClearText] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);  
  const delayForResultsMessage = 1000;

  const noMainSaveButton = true;
  const viewAndEditMomentAsBubble = false;
 

  const handleMomentToggle = (screenState) => {
    console.log(screenState); 
    setMomentEditMode(screenState);
  };


  const handleCategorySelect = (category) => {
    setSelectedCategory(category); 
  };
  

  const handleInputChange = (text) => {
    setTextInput(text);
    setUserEntryCapsule(text);
    if (updateTextInFocusScreen) {
    updateTextInFocusScreen(text);
    };
  };

  const resetTextInput = () => {
    setTextInput('');
    setUserEntryCapsule('');
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
          capsule: userEntryCapsule,
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
          {friendFixed == false && (
          <View style={styles.selectFriendContainer}>
            <FriendSelectModalVersion width='100%' />
          </View>
          )}
        { selectedFriend  && (  
        <View style={styles.locationContainer}>
          <EnterMoment
            handleInputChange={handleInputChange}
            textInput={textInput}
            placeholderText="Enter moment here..."
            handleNextScreen={() => {}}  
            onScreenChange={handleMomentToggle} 
            resetText={clearText && isSuccess}
          />
        </View> 
        )}
        {userEntryCapsule && selectedFriend && !momentEditMode && ( 
          <View style={styles.categoryContainer}>
            <> 
             <CardCategoriesAsButtons onCategorySelect={handleCategorySelect} momentTextForDisplay={textInput} onParentSave={handleSave}/> 
           
            </> 
          </View>
        )} 
        </>
      )}
        <HelloFriendFooter /> 
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 0, 
    justifyContent: 'space-between',  
  }, 
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {   
    width: '100%',      
  },
  categoryContainer: {  
    width: '100%', 
    borderRadius: 8,
    paddingTop: 10, 
  },
  selectFriendContainer: { 
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    alignItems: 'center',  
    width: '100%',   
    marginBottom: 0, 
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  bottomButtonContainer: { 
    width: '100%',  
  },
});

export default ContentAddMoment;
