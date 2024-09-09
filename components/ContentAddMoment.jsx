import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import EnterMoment from '../components/EnterMoment'; 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import AlertSuccessFail from '../components/AlertSuccessFail';
import AlertConfirm from '../components/AlertConfirm'; 

import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

const ContentAddMoment = () => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [ momentEditMode, setMomentEditMode] = useState(false);
  const [firstSectionTitle, setFirstSectionTitle] = useState('For: ');
  const [textInput, setTextInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryCapsules, setCategoryCapsules ] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userEntryCapsule, setUserEntryCapsule] = useState('');
 
  const [isConfirmModalVisible, setConfirmModalVisible ] = useState(false);
  const [ saveInProgress, setSaveInProgress ] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true); // Tracks if the last operation was successful or failed

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('For: ');
    }
  }, [selectedFriend, loadingNewFriend]);

  const handleMomentToggle = (screenState) => {
    console.log(screenState); 
    setMomentEditMode(screenState);
  };

  const toggleModal = () => {
    setConfirmModalVisible(!isConfirmModalVisible);
  };

  const handleCategorySelect = (category, capsulesForCategory) => {
    setSelectedCategory(category);
    setCategoryCapsules(capsulesForCategory); 
  };

  useEffect(() => {
    if (selectedCategory) {
        console.log('category in parent:', selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => { 
    const categories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setUniqueCategories(categories);
  }, [capsuleList]);

  const handleInputChange = (text) => {
    setTextInput(text);
    setUserEntryCapsule(text);
  };

  const resetTextInput = () => {
    setTextInput('');
    setUserEntryCapsule('');
  };

  const handleSave = async () => {
    setSaveInProgress(true); 
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
        };
   
        setCapsuleList(prevCapsules => [newCapsule, ...prevCapsules]);
   
        resetTextInput();
        setSelectedCategory('');
        setCategoryInput('');

        setAlertMessage('Moment has been saved!');
        setIsSuccess(true); // Successful save
      }
    } catch (error) {
      console.error('Error saving capsule:', error);
      setAlertMessage('Could not save moment.');
      setIsSuccess(false); // Failed save
    } finally {
      setSaveInProgress(false); 
      setAlertModalVisible(true); // Show the modal after attempt
      toggleModal();
    }
  };

  const closeAlertModal = () => {
    setAlertModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.locationTitle}> </Text>

        <View style={styles.selectFriendContainer}>
          <Text style={styles.locationTitle}>{firstSectionTitle}</Text>
          <FriendSelectModalVersion width='88%' />
        </View>

        <View style={styles.locationContainer}>
          <EnterMoment
            handleInputChange={handleInputChange}
            textInput={textInput}
            placeholderText="Enter moment here..."
            handleNextScreen={() => {}}  
            onScreenChange={handleMomentToggle} 
            resetText={alertModalVisible && isSuccess}
          />
        </View> 
        {userEntryCapsule && selectedFriend && !momentEditMode && ( 
          <View style={styles.categoryContainer}>
            <>
            <Text style={styles.locationTitle}>Category: {selectedCategory}</Text>
                <CardCategoriesAsButtons onCategorySelect={handleCategorySelect}/> 
            </> 
          </View>
        )}
        {userEntryCapsule && selectedCategory && ( 
          <View style={styles.bottomButtonContainer}>  
            <ButtonBottomActionBase
              onPress={toggleModal}
              preLabel=''
              label={`Add moment`}
              height={54}
              radius={16}
              fontMargin={3} 
              labelFontSize={22}
              labelColor="white" 
              labelContainerMarginHorizontal={4} 
              showGradient={true}
              showShape={true}
              shapePosition="right"
              shapeSource={CompassCuteSvg}
              shapeWidth={100}
              shapeHeight={100}
              shapePositionValue={-14}
              shapePositionValueVertical={-10} 
            />
          </View> 
        )}
      </View>

      <AlertConfirm
        fixedHeight={true}
        height={224}
        isModalVisible={isConfirmModalVisible}
        questionText=""
        isFetching={saveInProgress}
        useSpinner={true}
        toggleModal={toggleModal}
        headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Save moment?</Text>}
        onConfirm={handleSave} 
        onCancel={toggleModal}
        confirmText="Yes!"
        cancelText="Cancel"
      />

      <AlertSuccessFail
        isVisible={alertModalVisible}
        message={alertMessage}
        onClose={closeAlertModal}
        isSuccess={isSuccess} // Indicates success or failure
        tryAgain={!isSuccess}
        onRetry={handleSave}
        isFetching={saveInProgress}
        type='both' // Set to 'both' to handle success and failure in the same modal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
    paddingBottom: 68,
  },
  locationContainer: { 
    borderRadius: 8,
    top: 70,
    position: 'absolute',
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 10, 
    height: 360,
  },
  categoryContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectFriendContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0, 
    borderRadius: 8,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8,
    height:' auto',
    zIndex: 1, 
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  bottomButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    height: 72,
    paddingHorizontal: 10,
  },
});

export default ContentAddMoment;
