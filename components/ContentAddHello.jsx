import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';
import { LinearGradient } from 'expo-linear-gradient';

import { useMessage } from '../context/MessageContext';


 
import FriendSelectModalVersionButtonOnly from '../components/FriendSelectModalVersionButtonOnly';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useFriendList } from '../context/FriendListContext'; 
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveHello } from '../api';

import PickerMultiMoments from '../components/PickerMultiMoments';

import TextAreaBase from '../components/TextAreaBase';
import Icon from 'react-native-vector-icons/FontAwesome';
import PickerDate from '../components/PickerDate'; 
import PickerHelloType from '../components/PickerHelloType';
import PickerHelloLocation from '../components/PickerHelloLocation'; 

 

const ContentAddHello = () => {

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { showMessage } = useMessage();
 

  const { authUserState } = useAuthUser(); 
  const { selectedFriend, setFriend, loadingNewFriend} = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
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
  
 
   
  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();
   
  const timeoutRef = useRef(null);
  
  const createHelloMutation = useMutation({
    mutationFn: (data) => saveHello(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset(); 
      }, 2000); 

    },
    onSuccess: (data) => {queryClient.setQueryData(['pastHelloes'], (old) => {
            const updatedHelloes = old ? [data, ...old] : [data];
            return updatedHelloes; 

        });
 
        const actualHelloesList = queryClient.getQueryData(['pastHelloes']);
        console.log('Actual HelloesList after mutation:', actualHelloesList);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
          createHelloMutation.reset(); 
        }, 2000);
      }, 
});

useEffect(() => {
  if (createHelloMutation.isSuccess) {
    showMessage(true, null, 'Hello saved!');
    setUpdateTrigger((prev) => !prev); 
    setFriend(null); 
    navigateToMainScreen();
  }

}, [createHelloMutation.isSuccess]);


 
const handleCreateHello = async (helloData) => {
  const hello = {
    user: authUserState.user.id,
    friend: helloData.friend, 
    type: helloData.type,
    typed_location: helloData.manualLocation,
    additional_notes: helloData.notes,
    location: helloData.locationId,
    date: helloData.date,
    thought_capsules_shared: helloData.momentsShared,
    delete_all_unshared_capsules: deleteMoments ? true : false,
  };

  console.log('Payload before sending:', hello);

  try {
    
    await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
  } catch (error) {
      console.error('Error saving hello:', error);
  }
};


useLayoutEffect(() => {

  showMessage(true, null, 'Changes made on this page will not be saved if you exit.');
}, []);
 

  const toggleDeleteMoments = () => {
    setDeleteMoments(!deleteMoments);
  };

  const navigateToMainScreen = () => {
    navigation.navigate('hellofriend');

};


 

const handleNotesInputChange = (text) => {
  setAdditionalNotes(text);
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
          friend: selectedFriend.id, 
          type: selectedTypeChoiceText,
          manualLocation: customLocation,
          notes: additionalNotes,
          locationId: existingLocationId,
          date: formattedDate,
          momentsShared: momentsDictionary,
          deleteMoments: deleteMoments ? true : false,
        
        };
        
        await handleCreateHello(requestData); 
      }
    } catch (error) {
      console.log('catching errors elsewhere, not sure i need this', error);  
    };
  };





useEffect(() => {

  if (createHelloMutation.isError) {
    showMessage(true, null, 'Error saving Hello. Please try again!');
  }

}, [createHelloMutation.isError]);
 
   

  return (
           <LinearGradient
          colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}  
          style={[styles.container]} 
        > 
 
 
 
        <> 

        <View style={{width: '100%', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '28%'}}> 
 
          <View style={[styles.selectFriendContainer, {marginBottom: '2%'}]}> 
            <FriendSelectModalVersionButtonOnly includeLabel={true} width='100%' />
          </View> 

          <View style={[styles.backColorContainer, themeStyles.genericTextBackground, {borderColor: themeAheadOfLoading.lightColor}]}>
            
            <View style={{height: '10%', marginVertical: '2%'}}>
              <PickerHelloType  
                      containerText=''
                      selectedTypeChoice={selectedTypeChoice} 
                      onTypeChoiceChange={handleTypeChoiceChange}  
                      useSvg={true} 
                      widthInPercentage='100%'
                      height='30%'
              /> 
              </View>
         
 

          {selectedTypeChoiceText && ( 
          <View style={{flex: 1, width: '100%'}}>

          
           <View style={{flexDirection: 'row', marginVertical: '2%', justifyContent: 'space-between'}}>  
            <View style={{flex: 1, marginRight: 4, width: '4%'}}>
             <PickerHelloLocation 
                    buttonHeight={36}
                    buttonRadius={10}
                    onLocationChange={handleLocationChange}
                    modalVisible={locationModalVisible}
                    setModalVisible={setLocationModalVisible}
                    selectedLocation={selectedHelloLocation} 
              />   
              </View>
              <View style={{flex: 1, width: '44%'}}>
                <PickerDate
                  buttonHeight={36}
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
           

            <View style={[styles.notesContainer, {marginVertical: '6%'}]}>
              <TextAreaBase 
                containerText={'NOTES'}
                onInputChange={handleNotesInputChange}
                placeholderText={'Optional'}
              />
              </View>
 
             <View style={[styles.momentsContainer, {marginVertical: '2%', flex: 1, width: '100%', height: 'auto'}]}>
            <PickerMultiMoments
              onMomentSelect={handleMomentSelect}
             /> 
             </View>
          <View style={[styles.deleteRemainingContainer, {marginVertical: '2%'}]}>
            <TouchableOpacity onPress={toggleDeleteMoments} style={[styles.controlButton, themeStyles.footerIcon]}>
              <Text style={[styles.controlButtonText, {color: themeStyles.footerText.color}]}>{ "DELETE UNUSED MOMENTS"}</Text>
              <Icon name={deleteMoments ? "check-square-o" : "square-o"} size={20} style={[styles.checkbox, themeStyles.footerIcon]} />
            </TouchableOpacity>



          </View>
          </View>
        )}
         

          </View>
          
          </View>
          <View style={styles.buttonContainer}>            
          {helloDate && selectedFriend && !loadingNewFriend && (selectedTypeChoice !== null) ? (
            <ButtonBaseSpecialSave
              label="SAVE HELLO! "
              maxHeight={80}
              onPress={handleSave} 
              isDisabled={false}
              fontFamily={'Poppins-Bold'}
              image={require("../assets/shapes/redheadcoffee.png")}
            
            />

          ) : (
            null
          )} 
           </View>
          </>  
          
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '100%',
    justifyContent: 'space-between', 
  }, 
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backColorContainer: {  
    minHeight: '98%',
    alignContent: 'center',
    paddingHorizontal: '4%',
    paddingTop: '8%',
    paddingBottom: '32%', 
    width: '101%',
    alignSelf: 'center',
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    height: 'auto',
    flex: 1,
    paddingTop: 0,
  },
  momentsContainer: { 
    flex: 1, 
    width: '100%',     
    minHeight: 100, 
  },
  selectFriendContainer: {   
    width: '100%',   
    justifyContent: 'center',
    minHeight: 30, 
    maxHeight: 30,
    height: 30,
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
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
    fontSize: 15, 
    fontFamily: 'Poppins-Regular', 
    justifyContent: 'center',
    alignItems: 'center', 
    alignContent: 'center',
  },
  buttonContainer: { 
    width: '104%', 
    height: 'auto',
    position: 'absolute',
    bottom: -10,
    flex: 1,
    right: -2,
    left: -2,
  }, 
});

export default ContentAddHello;
