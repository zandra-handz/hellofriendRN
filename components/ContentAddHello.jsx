import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
 
import { saveHello } from '../api';

import PickerMultiMoments from '../components/PickerMultiMoments';

import TextAreaBase from '../components/TextAreaBase';

import PickerDate from '../components/PickerDate'; 
import PickerHelloType from '../components/PickerHelloType';
import PickerHelloLocation from '../components/PickerHelloLocation'; 


import ButtonBottomSaveHello from '../components/ButtonBottomSaveHello';

import AlertYesNo from '../components/AlertYesNo';   
import AlertSuccessFail from '../components/AlertSuccessFail';

import LoadingPage from '../components/LoadingPage';

const ContentAddHello = () => {

  const navigation = useNavigation();

  const { themeStyles } = useGlobalStyle();

  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend, friendDashboardData, setFriend } = useSelectedFriend();
  
  const [helloDate, setHelloDate] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState(["via text or social media", "in person", "happenstance", "unspecified"]);
  
  const [selectedTypeChoice, setSelectedTypeChoice] = useState(null);
  const [selectedTypeChoiceText, setSelectedTypeChoiceText] = useState(null);

  const [selectedHelloLocation, setSelectedHelloLocation] = useState('Select location');
  const [existingLocationId, setExistingLocationId ] = useState('');
  const [customLocation, setCustomLocation ] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);  

  const [firstSectionTitle, setFirstSectionTitle] = useState('For: ');
  const [momentsSelected, setMomentsSelected] = useState([]);
  
  const [isDeleteChoiceModalVisible, setDeleteChoiceModalVisible] = useState(false);
  
  const [deleteChoice, setDeleteChoice ] = useState(false); 
  
  const [ saveInProgress, setSaveInProgress ] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);


  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();
  


  const handleDeleteChoiceToggle = (isToggledYes) => {
    setDeleteChoice(isToggledYes ? true : false);
    console.log('Toggle state:', isToggledYes ? 'Yes' : 'No');
  };

  const navigateToMainScreen = () => {
    navigation.navigate('hellofriend');

};

const handleNotesInputChange = (text) => {
  setAdditionalNotes(text);
};

const resetAdditionalNotes = () => {
  setAdditionalNotes('');
};

  useEffect(() => {
    console.log(deleteChoice);
  }, [deleteChoice]);
 

  const handleTypeChoiceChange = (index) => {
    
    
    setSelectedTypeChoice(index); 
    setSelectedTypeChoiceText(`${typeChoices[index]}`); 
    console.log(`Hello type selected: ${typeChoices[index]}`);

    if (index === 1 || index === 2) {
      console.log('open location modal');

      toggleLocationModal(); 
    } else {
      setSelectedHelloLocation('None'); 
    };
    console.log(index);
  };

  const toggleLocationModal = () => {
  
    setLocationModalVisible(!locationModalVisible);
    console.log('location modal toggled');
  };

  const handleLocationChange = (item) => {
    if (item && item.id) { 
      setSelectedHelloLocation(item.title);
      setExistingLocationId(item.id);
      setCustomLocation(null);
    } else { 
      if (item) { 
      setSelectedHelloLocation(item);
      setCustomLocation(item);
      setExistingLocationId(null);
      } else {
        setSelectedHelloLocation('None');
      }
    }
  };

  const handleMomentSelect = (selectedMoments) => {
    setMomentsSelected(selectedMoments);
    console.log('Selected Moments in Parent:', selectedMoments);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || friendDate;
    setShowDatePicker(false);

    const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    setHelloDate(dateWithoutTime);
    console.log(dateWithoutTime); 
};
  
  const handleSave = async () => {
    setDeleteChoiceModalVisible(false);
    setSaveInProgress(true); 

    try {
      if (selectedFriend) {
        const formattedDate = helloDate.toISOString().split('T')[0];
        const momentsDictionary = {};
        momentsSelected.forEach((moment) => {
          momentsDictionary[moment.id] = {
            typed_category: moment.typedCategory,
            capsule: moment.capsule,
          };
        });
        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id, 
          type: selectedTypeChoiceText,
          typed_location: customLocation,
          additional_notes: additionalNotes,
          location: existingLocationId,
          date: formattedDate,
          thought_capsules_shared: momentsDictionary,
          delete_all_unshared_capsules: deleteChoice ? true : false,
        };
        
        const response = await saveHello(requestData);
        setSuccessModalVisible(true); 
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error('Error saving hello: ', error);
      setFailModalVisible(true);
    } finally {
      setSaveInProgress(false); 
    };
    
  };

  const successOk = () => {
    setUpdateTrigger(prev => !prev); 
    setFriend(null);
    navigateToMainScreen();
    setSuccessModalVisible(false);
};

const failOk = () => { 
    setFailModalVisible(false);
};
   

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}> 

        <View style={styles.selectFriendContainer}> 

          <FriendSelectModalVersion width='100%' />
        </View> 
        <View style={styles.typeChoicesContainer}>
            <PickerHelloType  
                containerText=''
                selectedTypeChoice={selectedTypeChoice} 
                onTypeChoiceChange={handleTypeChoiceChange}  
                useSvg={true} 
                widthInPercentage='100%'
         />
            </View>

            {!selectedTypeChoiceText &&  ( 
            <View style={{ height: '69%'}}>
            </View>
          )}
          {selectedTypeChoiceText && ( 
          <>
           <View style={{flexDirection: 'row'}}>  
            <View style={[styles.locationContainer, {paddingRight: 3}]}> 
              <PickerHelloLocation 
                    buttonHeight={56}
                    buttonRadius={10}
                    onLocationChange={handleLocationChange}
                    modalVisible={locationModalVisible}
                    setModalVisible={setLocationModalVisible}
                    selectedLocation={selectedHelloLocation} 
              />  
              </View> 
              <View style={[styles.locationContainer, {paddingLeft: 3}]}> 
              <PickerDate
                buttonHeight={56}
                value={helloDate}
                mode="date"
                display="default"
                containerText=""
                maximumDate={new Date()}
                onChange={onChangeDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}   
                inline={true}
            />
            </View>
            </View> 
           

          <View style={styles.notesContainer}>
            <TextAreaBase 
              containerText={'Additional notes:'}
              onInputChange={handleNotesInputChange}
              placeholderText={''}
            />

            </View>
            
            <View style={styles.momentsContainer}> 
            <PickerMultiMoments
              onMomentSelect={handleMomentSelect}
             />
          </View>
          </>
           )}
         
         
            {helloDate && selectedFriend && (selectedTypeChoice !== null) ? (
              <View>  
                <ButtonBottomSaveHello
                  onPress={setDeleteChoiceModalVisible} 
                  disabled={false}
                />
              </View>
            ) : (
              <View>  
                <ButtonBottomSaveHello
                  onPress={setDeleteChoiceModalVisible} 
                  disabled={true}
                />
            </View>
          )}  
        </View>
      <AlertYesNo
          isModalVisible={isDeleteChoiceModalVisible}
          isFetching={saveInProgress}
          useSpinner={true}
          toggleModal={() => setDeleteChoiceModalVisible(false)}
          headerContent={<Text>Adding hello</Text>}
          questionText="Do you want to clear out all unshared moments?"
          onConfirm={handleSave}
          onToggle={handleDeleteChoiceToggle}
          onCancel={() => setDeleteChoiceModalVisible(false)}
          confirmText="Save hello"
          cancelText="Go back"
        />
          <AlertSuccessFail
            isVisible={isSuccessModalVisible}
            message={`Hello has been added!`}
            onClose={successOk}
            type='success'
        />

        <AlertSuccessFail
            isVisible={isFailModalVisible}
            message={`Could not add Hello.`}
            onClose={failOk}
            tryAgain={false}
            onRetry={handleSave}
            isFetching={saveInProgress}
            type='failure'
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  mainContainer: {
    flex: 1, 
    justifyContent: 'space-between', 
  },
  typeChoicesContainer: {   
    width: '100%', 
  },
  locationContainer: {   
    width: '50%',   
  },
  dateContainer: {   
    width: '50%',     
  },
  notesContainer: {  
    width: '100%',  
    minHeight: 140, 
  },
  momentsContainer: {  
    width: '100%',   
    minHeight: 280, 
  },
  selectFriendContainer: { 
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    alignItems: 'center',
    textAlign: 'center', 
    width: '100%',   
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },   
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },  
});

export default ContentAddHello;
