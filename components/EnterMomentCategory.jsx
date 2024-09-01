
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { saveThoughtCapsule, deleteThoughtCapsule } from '../api';

import ContainerEditCapsules from '../components/ContainerEditCapsules';
import { useAuthUser } from '../context/AuthUserContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

const EnterMomentCategory = ({ userEntryCapsule, viewOldStyle=false }) => {
  
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [textInput, setTextInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Start typing your thought here');
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState('');
 
  const [isFirstScreen, setIsFirstScreen] = useState(true); // Track which screen the user is on


  useEffect(() => {
    // Filter unique categories from the capsuleList
    const categories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setUniqueCategories(categories);
  }, [capsuleList]);

  useEffect(() => {
    if (selectedFriend) {
      fetchInitialData();
    }
  }, [selectedFriend]);

  // Not sure why I have two separate ones
  useEffect(() => {
    if (friendDashboardData) {
      fetchInitialData();
    }
  }, [friendDashboardData]);

  const fetchInitialData = async () => {
    try {
      if (friendDashboardData && friendDashboardData.length > 0) {
        const firstFriendData = friendDashboardData[0];
        const categoryLimitResponse = firstFriendData.suggestion_settings.category_limit_formula;
        const categoryActivationsLeft = firstFriendData.category_activations_left;
        const categoryLimitValue = parseInt(categoryLimitResponse);
        setCategoryLimit(categoryLimitValue);
        setRemainingCategories(categoryActivationsLeft);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };
 

  const handleCategoryInputChange = (text) => {
    setCategoryInput(text);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryInput('');
  };

  const onSave = async (data) => { 
    const updatedCategories = [...uniqueCategories, data.typedCategory];
    setUniqueCategories(updatedCategories);
  };

  const handleSave = async () => {
    try {
      if (selectedFriend) {
        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id,
          typed_category: selectedCategory || categoryInput,
          capsule: userEntryCapsule, // User's text input is used here
        };

        const response = await saveThoughtCapsule(requestData);

        // Add the saved capsule to the capsuleList
        const updatedCapsuleList = [
          ...capsuleList,
          {
            id: response.id,
            typedCategory: response.typed_category,
            capsule: response.capsule,
          }
        ];

        setCapsuleList(updatedCapsuleList);

        // Clear input fields and set success message
        setTextInput('');
        setCategoryInput('');
        setSelectedCategory('');
        setSuccessMessage('Idea saved successfully!');

        // Call the onSave function with the response data
        onSave(response);
      }
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const handleDelete = async (capsuleId) => {
    try {
      await deleteThoughtCapsule(capsuleId);
      const updatedCapsuleList = capsuleList.filter(capsule => capsule.id !== capsuleId);
      setCapsuleList(updatedCapsuleList);
    } catch (error) {
      console.error('Error deleting thought capsule:', error);
    }
  };


  return ( 
    <View style={styles.container}>
        <CardCategoriesAsButtons/> 
        {viewOldStyle && (
            <>  
        <TextInput
            style={styles.input}
            value={categoryInput}
            onChangeText={handleCategoryInputChange}
            placeholder="New Category"
                /> 
            <Picker
                selectedValue={selectedCategory}
                style={styles.input}
                onValueChange={handleCategoryChange}
            >
            <Picker.Item label="Select existing category" value="" />
            {uniqueCategories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
            ))}
        </Picker> 
        </>
       )}
      {selectedCategory && (
        <Text style={styles.selectedCategory}>Selected category: {selectedCategory}</Text>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity> 
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
       
    ) : (
        <ContainerEditCapsules
        capsulesForSelectedCategory={capsuleList.filter(capsule => capsule.typedCategory === selectedCategory)}
          remainingCategories={remainingCategories}
          handleDelete={handleDelete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  enteredTextContainer: {
    width: '100%',
    padding: 10,
  },
  enteredText: { 
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    width: '100%',
  },
  selectedCategory: {
    marginTop: 10,
    fontSize: 18,
  },
  successMessage: {
    marginTop: 10,
    fontSize: 18,
    color: '#28a745',
  },
});

export default EnterMomentCategory;
