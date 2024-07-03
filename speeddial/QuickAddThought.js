import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend, friendDashboardData } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule, deleteThoughtCapsule } from '../api';
import { Picker } from '@react-native-picker/picker';
import ContainerEditCapsules from '../components/ContainerEditCapsules';
import TextAreaMoment from './TextAreaMoment'; // Import the new component

const QuickAddThought = () => {
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
  const [userEntryCapsule, setUserEntryCapsule] = useState('');
  const [isFirstScreen, setIsFirstScreen] = useState(true); // Track which screen the user is on

  useEffect(() => {
    // Filter unique categories from the capsuleList
    const categories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setUniqueCategories(categories);
  }, [capsuleList]);

  useEffect(() => {
    // Update the placeholder text based on the selected category
    if (selectedCategory && userEntryCapsule === '') {
      setPlaceholderText(`Add thought to ${selectedCategory} here`);
    } else {
      setPlaceholderText('Start typing your thought here');
    }
  }, [selectedCategory, userEntryCapsule]);

  useEffect(() => {
    if (selectedFriend) {
      fetchInitialData();
    }
  }, [selectedFriend]);

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

  useEffect(() => {
    if (friendDashboardData) {
      fetchInitialData();
    }
  }, [friendDashboardData]);

  const handleInputChange = (text) => {
    setTextInput(text);
    setUserEntryCapsule(text); // Update user's entry capsule
  };

  const handleCategoryInputChange = (text) => {
    setCategoryInput(text);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryInput('');
  };

  const onSave = async (data) => {
    // Update unique categories after saving a new category
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

  // Function to move to the second screen
  const handleNextScreen = () => {
    setIsFirstScreen(false); // Set isFirstScreen to false to move to the second screen
  };

  return (
    <View style={styles.container}>
      {selectedFriend ? (
        <View style={styles.modal}>
          {isFirstScreen ? (
            <FirstScreen
              handleInputChange={handleInputChange}
              textInput={textInput}
              placeholderText={placeholderText}
              handleNextScreen={handleNextScreen}
            />
          ) : (
            <SecondScreen
              handleCategoryInputChange={handleCategoryInputChange}
              handleCategoryChange={handleCategoryChange}
              handleSave={handleSave}
              handleBack={() => setIsFirstScreen(true)}
              categoryInput={categoryInput}
              selectedCategory={selectedCategory}
              uniqueCategories={uniqueCategories}
              remainingCategories={remainingCategories}
              handleDelete={handleDelete}
              successMessage={successMessage}
              userEntryCapsule={userEntryCapsule}
              capsulesForSelectedCategory={capsuleList.filter(capsule => capsule.typedCategory === selectedCategory)}
            />
          )}
        </View>
      ) : (
        <Text style={styles.title}>Please select a friend first</Text>
      )}
    </View>
  );
};

const FirstScreen = ({
  handleInputChange,
  textInput,
  placeholderText,
  handleNextScreen,
}) => (
  <>
    <TextAreaMoment
      onInputChange={handleInputChange}
      initialText={textInput}
      placeholderText={placeholderText}
      autoFocus={true}
    />
    <TouchableOpacity style={styles.nextButton} onPress={handleNextScreen}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  </>
);

const SecondScreen = ({
  handleCategoryInputChange,
  handleCategoryChange,
  handleSave,
  handleBack,
  categoryInput,
  selectedCategory,
  uniqueCategories,
  capsulesForSelectedCategory,
  remainingCategories,
  handleDelete,
  successMessage,
  userEntryCapsule,
}) => (
  <>
    {/* Display the text entered on the first screen */}
    <Text style={styles.enteredText}>{userEntryCapsule}</Text>
    <TextInput
      style={styles.input}
      value={categoryInput}
      onChangeText={handleCategoryInputChange}
      placeholder="New Category"
    />
    {/* Render unique categories as Picker */}
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
    {/* Display the name of the selected category */}
    {selectedCategory && (
      <Text style={styles.selectedCategory}>Selected category: {selectedCategory}</Text>
    )}
    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
      <Text style={styles.saveButtonText}>Save</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    {successMessage ? (
      <Text style={styles.successMessage}>{successMessage}</Text>
    ) : (
      <ContainerEditCapsules
        capsules={capsulesForSelectedCategory}
        remainingCategories={remainingCategories}
        handleDelete={handleDelete}
      />
    )}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  nextButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
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
  enteredText: {
    fontSize: 16,
    marginBottom: 10,
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

export default QuickAddThought;
