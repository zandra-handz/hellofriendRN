import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
 
import { saveHello } from '../api';

import PickerMultiMoments from '../components/PickerMultiMoments';

import TextAreaBase from '../components/TextAreaBase';
import Icon from 'react-native-vector-icons/FontAwesome';
import PickerDate from '../components/PickerDate'; 
import PickerHelloType from '../components/PickerHelloType';
import PickerHelloLocation from '../components/PickerHelloLocation'; 


import ButtonBottomSaveHello from '../components/ButtonBottomSaveHello';
 
import LoadingPage from '../components/LoadingPage';

const ContentAddHello = () => {

  const navigation = useNavigation();
 

  const { authUserState } = useAuthUser(); 
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
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
  const [momentsSelected, setMomentsSelected] = useState([]);
  const [deleteMoments, setDeleteMoments ] = useState(false); 
  
  const [ saveInProgress, setSaveInProgress ] = useState(false);
  
  const [ resultMessage, setResultMessage ] = useState(null);
  const [ gettingResultMessage, setGettingResultMessage ] = useState(null);
  
  const delayForResultsMessage = 2000;
   
  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();
   

 

  const toggleDeleteMoments = () => {
    setDeleteMoments(!deleteMoments);
  };

  const navigateToMainScreen = () => {
    navigation.navigate('hellofriend');

};

useEffect(() => {
  if (!selectedFriend && updateTrigger) {
    setUpdateTrigger((prev) => !prev);  
    navigation.navigate('hellofriend'); 

  };

}, [selectedFriend, updateTrigger]);

const handleNotesInputChange = (text) => {
  setAdditionalNotes(text);
};

const resetAdditionalNotes = () => {
  setAdditionalNotes('');
}; 
 

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
    setSaveInProgress(true); 
    setGettingResultMessage(true);

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
          delete_all_unshared_capsules: deleteMoments ? true : false,
        };
        
        await saveHello(requestData); 

        setResultMessage('Hello saved!');
        setGettingResultMessage(true); 
        
         

        let timeout; 
        timeout = setTimeout(() => {
          setGettingResultMessage(false); 
          setUpdateTrigger((prev) => !prev);  
          setFriend(null);
          
        }, delayForResultsMessage);  
 

        
        return () => clearTimeout(timeout);

      }
    } catch (error) {
      setResultMessage('Error! Could not save message');
      setGettingResultMessage(true);
      let timeout;
  
      timeout = setTimeout(() => {
        setGettingResultMessage(false);
      }, delayForResultsMessage);  
      return () => clearTimeout(timeout);
    } finally {
      setSaveInProgress(false); 
    };

    setSaveInProgress(false);
    
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
            label="Saving hello..."
          />
          </View>
        )}


        {!gettingResultMessage && ( 
        <> 

        <View style={{width: '100%', flexDirection: 'column', justifyContent: 'space-between', height: 130}}> 
        
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
          </View>

          {selectedTypeChoiceText && ( 
          <>
          <View style={{height: 10}}/>
           <View style={{flexDirection: 'row'}}>  
            <View style={[styles.locationContainer, {paddingRight: 3}]}> 
              <PickerHelloLocation 
                    buttonHeight={40}
                    buttonRadius={24}
                    onLocationChange={handleLocationChange}
                    modalVisible={locationModalVisible}
                    setModalVisible={setLocationModalVisible}
                    selectedLocation={selectedHelloLocation} 
              />  
              </View> 
              <View style={[styles.locationContainer, {paddingLeft: 3}]}> 
                <PickerDate
                  buttonHeight={40}
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
                containerText={'Add notes?'}
                onInputChange={handleNotesInputChange}
                placeholderText={''}
              />
              </View>
 
            
            <View style={styles.momentsContainer}> 
            <PickerMultiMoments
              onMomentSelect={handleMomentSelect}
             />
          </View>
          <View style={styles.deleteRemainingContainer}>
            <TouchableOpacity onPress={toggleDeleteMoments} style={[styles.controlButton, themeStyles.footerIcon]}>
              <Text style={[styles.controlButtonText, themeStyles.footerText]}>{ "Delete unused moments"}</Text>
              <Icon name={deleteMoments ? "check-square-o" : "square-o"} size={20} style={[styles.checkbox, themeStyles.footerIcon]} />
            </TouchableOpacity>



          </View>
          </>
           )}
         
         
            {helloDate && selectedFriend && (selectedTypeChoice !== null) ? (
              <View>  
                <ButtonBottomSaveHello
                  onPress={handleSave} 
                  disabled={false}
                />
              </View>
            ) : (
              <View>  
                <ButtonBottomSaveHello
                  onPress={[() => {}]} 
                  disabled={true}
                />
            </View>
          )}  
          </>  
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between', 
  }, 
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeChoicesContainer: {   
    height: 70, 
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
    paddingTop: 20,
  },
  momentsContainer: {  
    width: '100%', 
    paddingTop: 10,   
    minHeight: 280, 
  },
  selectFriendContainer: {   
    height: 70,
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
  deleteRemainingContainer: {
    
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: 30, 

  },
  checkbox: {
    paddingLeft: 10,  
    paddingBottom: 2,
    paddingRight: 1,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular', 
    justifyContent: 'center',
    alignItems: 'center', 
    alignContent: 'center',
  },
});

export default ContentAddHello;
