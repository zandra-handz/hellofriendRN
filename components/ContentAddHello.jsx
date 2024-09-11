import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';

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

const ContentAddHello = () => {

  const navigation = useNavigation();

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
 


  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('For: ');
    }
  }, [selectedFriend, loadingNewFriend]);


  const handleTypeChoiceChange = (index) => {
    setSelectedTypeChoice(index);
    setSelectedTypeChoiceText(`${typeChoices[index]}`);
    console.log(`Selected type: ${typeChoices[index]}`);
    console.log(index);
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
        <Text style={styles.locationTitle}>{firstSectionTitle}</Text>

          <FriendSelectModalVersion width='88%' />
        </View> 
        <View style={styles.typeChoicesContainer}>
            <PickerHelloType  
                containerText='Type: '
                selectedTypeChoice={selectedTypeChoice} 
                onTypeChoiceChange={handleTypeChoiceChange}  
                useSvg={true} 
         />
            </View>
           
            <View style={styles.locationContainer}> 
            {(selectedTypeChoice === 1 || selectedTypeChoice === 2) && (
                <PickerHelloLocation  
                    onLocationChange={handleLocationChange}
                    selectedLocation={selectedHelloLocation} 
              /> 
              )}
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



          <View style={styles.dateContainer}> 
            <PickerDate
                value={helloDate}
                mode="date"
                display="default"
                containerText="Date: "
                maximumDate={new Date()}
                onChange={onChangeDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}   
                inline={true}
            />
          </View>  
            {helloDate && selectedFriend && (selectedTypeChoice !== null) ? (
              <View style={styles.bottomButtonContainer}>  
                <ButtonBottomSaveHello
                  onPress={setDeleteChoiceModalVisible} 
                  disabled={false}
                />
              </View>
            ) : (
              <View style={styles.bottomButtonContainer}>  
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
    paddingBottom: 68,
  },
  typeChoicesContainer: {  
    borderRadius: 8, 
    width: '100%',
    paddingVertical: 10, 
    height: 60,  
  },
  locationContainer: {  
    borderRadius: 8, 
    width: '100%', 
    height: 42,
  },
  dateContainer: {  
    borderRadius: 8, 
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 10, 
    height: 60,
  },
  notesContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 0,
    minHeight: 140, 
  },
  momentsContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 0,
    minHeight: 280, 
  },
  selectFriendContainer: { 
    flexDirection: 'row', 
    borderRadius: 8,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8, 
    zIndex: 1, 
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  locationAddress: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  cardContainer: {
    marginVertical: 10,
  },
  previewContainer: {
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  }, 
  bottomButtonContainer: {
    height: '12%', 
    padding: 0,
    paddingTop: 40,
    top: 660,
    paddingHorizontal: 10,  
    position: 'absolute', 
    zIndex: 1,
    bottom: 0, 
    right: 0,
    left: 0,
  },
});

export default ContentAddHello;
