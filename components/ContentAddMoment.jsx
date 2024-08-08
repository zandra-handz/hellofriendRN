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
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';


import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

const ContentAddMoment = () => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [ momentEditMode, setMomentEditMode] = useState(false);
  const [firstSectionTitle, setFirstSectionTitle] = useState('Select friend');
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
      setFirstSectionTitle('Change friend');
    }
  }, [selectedFriend, loadingNewFriend]);

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
        <Text style={styles.locationTitle}>{firstSectionTitle}</Text>

        <View style={styles.selectFriendContainer}>
          <FriendSelectModalVersion />
        </View>

        <View style={styles.locationContainer}>
          <EnterMoment
            handleInputChange={handleInputChange}
            textInput={textInput}
            placeholderText="Enter your moment here..."
            handleNextScreen={() => {}}  
            onScreenChange={handleMomentToggle} 
          />
        </View>
        <View style={styles.categoryContainer}>
        {userEntryCapsule && selectedFriend && !momentEditMode && ( 
            <>
            <Text style={styles.locationTitle}>Category: {selectedCategory}</Text>
            
                <CardCategoriesAsButtons onCategorySelect={handleCategorySelect}/> 
            </>
            )}
        </View>
        {userEntryCapsule && selectedCategory && ( 
                <View style={styles.bottomButtonContainer}>  
                    <ButtonLottieAnimationSvg
                        onPress={handleSave}
                        preLabel=''
                        label={`Add moment`}
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
  locationContainer: { 
    borderRadius: 8,
    top: 80,
    position: 'absolute',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10, 
    height: 360,
  },
  categoryContainer: { 
    borderRadius: 8,
    top: 348,
    position: 'absolute',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10, 
    height: 300,
  },
  selectFriendContainer: {
    position: 'absolute',
    top: 30, 
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8,
    height: 40, 
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
  dateText: { 
    fontSize: 16,
    marginVertical: 14,
    fontFamily: 'Poppins-Bold',
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 20,
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

export default ContentAddMoment;
