import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';

import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
 
import { fetchTypeChoices, saveHello } from '../api';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';

import PickerMultiMoments from '../components/PickerMultiMoments';

import PickerDate from '../components/PickerDate';
import PickerMenuOptions from '../components/PickerMenuOptions';
import PickerComplexList from '../components/PickerComplexList';

import { useLocationList } from '../context/LocationListContext';


import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
import CoffeeMugFancySteamSvg from '../assets/svgs/coffee-mug-fancy-steam';
import CelebrationSparkOutlineSvg from '../assets/svgs/celebration-spark-outline';

import AlertYesNo from '../components/AlertYesNo';   

import AlertSuccessFail from '../components/AlertSuccessFail';

const ContentAddHello = () => {

  const navigation = useNavigation();

  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend, friendDashboardData, setFriend } = useSelectedFriend();
  const [helloDate, setHelloDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState([]);
  const [selectedTypeChoice, setSelectedTypeChoice] = useState(null);
  const [selectedTypeChoiceText, setSelectedTypeChoiceText] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const { locationList, faveLocationList,populateFaveLocationsList, savedLocationList } = useLocationList();
  const [isLocationListReady, setIsLocationListReady] = useState(false);
    
  const [selectedLocation, setSelectedLocation] = useState('Select location');
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

  useEffect(() => {
    console.log(deleteChoice);
  }, [deleteChoice]);

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('For: ');
    }
  }, [selectedFriend, loadingNewFriend]);


  useEffect(() => {
    if (loadingNewFriend) {
        setIsLocationListReady(false); 
    } else {
      setIsLocationListReady(true)
    };
  }, [loadingNewFriend]);

  useEffect(() => {
        if (friendDashboardData && friendDashboardData.length > 0) {
            const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];

            console.log('favorite location IDs: ', favoriteLocationIds);
            populateFaveLocationsList(favoriteLocationIds);

        }
    }, [locationList, friendDashboardData]);

  useEffect(() => {
        console.log('Favorite Locations:', faveLocationList); // Logging faveLocationList
    }, [faveLocationList]);

  useEffect(() => {
    if (locationList.length > 0) {
        setIsLocationListReady(true);
    }
  }, [locationList]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeChoices = await fetchTypeChoices();
        console.log("typeChoices: ", typeChoices);
        setTypeChoices(typeChoices);
      } catch (error) {
        console.error('Error fetching type choices:', error);
      }
    };
    fetchData();
  }, []);

  const svgIcons = [
    PhoneChatMessageHeartSvg, 
    CoffeeMugSolidHeart,
    CelebrationSparkOutlineSvg,
    CoffeeMugFancySteamSvg, 
  ];

  const labels = [
    'digital', 'in person', 'surprise', 'N/A'
  ];

  const handleTypeChoiceChange = (index) => {
    setSelectedTypeChoice(index);
    setSelectedTypeChoiceText(`${typeChoices[index]}`);
    console.log(`Selected type: ${typeChoices[index]}`);
    console.log(index);
  };

  const handleLocationChange = (item) => {
    if (item && item.id) { 
      setSelectedLocation(item.title);
      setExistingLocationId(item.id);
      setCustomLocation(null);
    } else { 
      if (item) { 
      setSelectedLocation(item);
      setCustomLocation(item);
      setExistingLocationId(null);
      } else {
        setSelectedLocation('None');
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
        <Text style={styles.locationTitle}> </Text>

        <View style={styles.selectFriendContainer}>
        <Text style={styles.locationTitle}>{firstSectionTitle}</Text>

          <FriendSelectModalVersion width='88%' />
        </View> 
        <View style={styles.typeChoicesContainer}>
            <PickerMenuOptions
                options={typeChoices}
                containerText='Type:'
                onSelectOption={handleTypeChoiceChange}
                selectedOption={selectedTypeChoice}
                containerStyle={styles.locationContainer}
                buttonStyle={styles.optionButton}
                buttonTextStyle={styles.optionText}
                useSvg={true}
                svgIcons={svgIcons}
                inline={true}
                labels={labels}
         />
            </View>
            {(selectedTypeChoice === 1 || selectedTypeChoice === 2) && (
            <View style={styles.locationContainer}>
            {isLocationListReady && (
            <PickerComplexList 
                containerText='Location: '
                inline={true}
                modalHeader='Select Location'
                allowCustomEntry={true}
                primaryOptions={faveLocationList}
                primaryOptionsHeader='Pinned'
                primaryIcon={LocationHeartSolidSvg}
                secondaryOptions={savedLocationList}
                secondaryOptionsHeader='All Saved'
                secondaryIcon={LocationSolidSvg}
                objects={true} 
                onLabelChange={handleLocationChange}
                label={selectedLocation}
                modalVisible={locationModalVisible}
                setModalVisible={setLocationModalVisible}
                containerStyle={styles.locationContainer}
                buttonStyle={styles.optionButton}
                buttonTextStyle={styles.optionText}  
         />
          )}
            </View>
            )}
            
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
                dateTextStyle={styles.dateText}
                containerStyle={styles.dateContainer}
                labelStyle={styles.locationTitle} 
                inline={true}
            />
          </View> 
        {helloDate && ( 
                <View style={styles.bottomButtonContainer}>  
                    <ButtonBottomActionBase
                        onPress={() => setDeleteChoiceModalVisible(true)}
                        preLabel=''
                        label={`Add hello`}
                        height={54}
                        radius={16} 
                        labelFontSize={22}
                        labelColor="white" 
                        labelContainerMarginHorizontal={4}
                        animationMargin={-64}
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
    padding: 0,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
    paddingBottom: 68,
  },
  typeChoicesContainer: { 
    borderRadius: 8,
    top: 12, 
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 10, 
    height: 90,
  },
  locationContainer: {  
    borderRadius: 8, 
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 0, 
    height: 90,
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
    height: 360,
  },
  momentsContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 0,
    minHeight: 400, 
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
