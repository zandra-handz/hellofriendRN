// ContentAddMoment.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EnterMoment from '../components/EnterMoment';
import EnterMomentCategory from '../components/EnterMomentCategory';
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api';
import { fetchTypeChoices, saveHello } from '../api';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import PickerDate from '../components/PickerDate';
import PickerMenuOptions from '../components/PickerMenuOptions';
import PickerComplexList from '../components/PickerComplexList';

import { useLocationList } from '../context/LocationListContext';


import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
import CoffeeCupPaperSolid from '../assets/svgs/coffee-cup-paper-solid';
import CoffeeMugFancySteamSvg from '../assets/svgs/coffee-mug-fancy-steam';
import CelebrationSparkOutlineSvg from '../assets/svgs/celebration-spark-outline';


import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

const ContentAddHello = () => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const [helloDate, setHelloDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState([]);
  const [selectedTypeChoice, setSelectedTypeChoice] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const { locationList, faveLocationList, tempLocationList, savedLocationList }  = useLocationList();
    
  const [selectedLocation, setSelectedLocation] = useState('Select location');
  
  
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [ momentEditMode, setMomentEditMode] = useState(false);
  const [firstSectionTitle, setFirstSectionTitle] = useState('Friend: ');
  const [textInput, setTextInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryCapsules, setCategoryCapsules ] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userEntryCapsule, setUserEntryCapsule] = useState('');
 
  
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('Friend: ');
    }
  }, [selectedFriend, loadingNewFriend]);

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
    console.log(`Selected type: ${typeChoices[index]}`);
  };

  const handleLocationChange = (item) => {
    setSelectedLocation(item.title);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || friendDate;
    setShowDatePicker(false);

    const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    setHelloDate(dateWithoutTime);
    console.log(dateWithoutTime); 
};

  const handleMomentToggle = (screenState) => {
    console.log(screenState); 
    setMomentEditMode(screenState);
  };
 


  const handleCategorySelect = (category, capsulesForCategory) => {
    setSelectedCategory(category);
    setCategoryCapsules(capsulesForCategory); 

    console.log('Category selected in parent:', category);
    console.log('Capsules for selected category in parent:', capsulesForCategory);
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


  const handleSave = async () => {
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
  
        // Add the new capsule to the front of the list
        setCapsuleList(prevCapsules => [newCapsule, ...prevCapsules]);
  
        setTextInput('');
        setCategoryInput('');
        setSuccessMessage('Capsule saved successfully!');
      }
    } catch (error) {
      console.error('Error saving capsule:', error);
    }
  };
  
 

  const handleDelete = (id) => {
    setCapsuleList(capsuleList.filter(capsule => capsule.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.locationTitle}> </Text>

        <View style={styles.selectFriendContainer}>
        <Text style={styles.locationTitle}>{firstSectionTitle}</Text>

          <FriendSelectModalVersion width='82%' />
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
            <View style={styles.locationContainer}>
            <PickerComplexList 
                containerText='Location: '
                inline={true}
                modalHeader='Select Location'
                primaryOptions={faveLocationList}
                primaryOptionsHeader='Pinned'
                secondaryOptions={locationList}
                secondaryOptionsHeader='All Saved'
                objects={true} 
                onLabelChange={handleLocationChange}
                label={selectedLocation}
                modalVisible={locationModalVisible}
                setModalVisible={setLocationModalVisible}
                containerStyle={styles.locationContainer}
                buttonStyle={styles.optionButton}
                buttonTextStyle={styles.optionText}  
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
                    <ButtonLottieAnimationSvg
                        onPress={handleSave}
                        preLabel=''
                        label={`Add hello`}
                        height={54}
                        radius={16}
                        fontMargin={3}
                        animationSource={require("../assets/anims/heartinglobe.json")}
                        rightSideAnimation={false}
                        labelFontSize={22}
                        labelColor="white"
                        animationWidth={234}
                        animationHeight={234}
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
                        showIcon={false}
                    />
            </View> 
            )}
      </View>
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
  textInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Poppins-Regular',

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