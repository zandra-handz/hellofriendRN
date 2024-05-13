import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';  
 
import { useSelectedFriend, friendDashboardData, updateFriendDashboardData } from '../context/SelectedFriendContext';  
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { saveThoughtCapsule, deleteThoughtCapsule } from '../api';  
import { Picker } from '@react-native-picker/picker';
import ContainerEditCapsules from '../components/ContainerEditCapsules'; // Import the new component

const QuickAddThoughtOld = () => {
    const { authUserState } = useAuthUser();
    const {selectedFriend, friendDashboardData, updateFriendDashboardData  } = useSelectedFriend();
 
    const { capsuleList, setCapsuleList } = useCapsuleList();
    const [textInput, setTextInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [displayedCapsules, setDisplayedCapsules] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const textareaRef = useRef();
    const [placeholderText, setPlaceholderText] = useState('Start typing your thought here');
    const [categoryLimit, setCategoryLimit] = useState('');
    const [remainingCategories, setRemainingCategories] = useState('');
    
    // Function to calculate unique categories count
    const calculateUniqueCategoriesCount = (capsuleList) => {
      const uniqueCategories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
      console.log('Unique categories count:', uniqueCategories.length);
      return uniqueCategories.length;
    };

    // Function to calculate remaining categories count
    const calculateRemainingCategories = (categoryLimit, capsuleList) => {
      const uniqueCategoriesCount = calculateUniqueCategoriesCount(capsuleList);
      console.log('Remaining categories count:', categoryLimit - uniqueCategoriesCount);
      return categoryLimit - uniqueCategoriesCount;
    };

    useEffect(() => {
      // Filter unique categories from the capsuleList
      const categories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
      setUniqueCategories(categories);
    }, [capsuleList]);

    useEffect(() => {
      // Filter the capsules to display based on the selected category
      if (selectedCategory) {
        const filteredCapsules = capsuleList.filter(capsule => capsule.typedCategory === selectedCategory);
        setDisplayedCapsules(filteredCapsules);
      } else {
        // If no category is selected, display no capsules
        setDisplayedCapsules([]);
      }
    }, [selectedCategory, capsuleList]);

    useEffect(() => {
      // Update the placeholder text based on the selected category
      if (selectedCategory && textInput === '') {
        setPlaceholderText(`Add thought to ${selectedCategory} here`);
      } else {
        setPlaceholderText('Start typing your thought here');
      }
    }, [selectedCategory, textInput]);

    useEffect(() => {
      if (selectedFriend) {
        fetchInitialData();
      }
    }, [selectedFriend]);


    const fetchInitialData = async () => {
        try {
          if (friendDashboardData && friendDashboardData.length > 0) {
            console.log("friendDashBoard at start of fetchInitialData: ", friendDashboardData);
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
    };

    const handleCategoryInputChange = (text) => {
      setCategoryInput(text);
    };

    const handleCategoryChange = (value) => {
      setSelectedCategory(value);
      setCategoryInput('');
      const textareaElement = textareaRef.current;
      if (textareaElement) {
        textareaRef.current.focus();
      }
    };

    const onSave = async (data) => { 
      console.log('Data saved:', data);
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
            capsule: textInput,
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
        <View style={styles.modal}>
          <Text style={styles.title}>Add a thought</Text>
          <TextInput
            style={styles.input}
            multiline={true}
            value={textInput}
            onChangeText={handleInputChange}
            placeholder={placeholderText}
          />
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
          {selectedCategory !== '' && (
            <Text style={styles.selectedCategory}>{selectedCategory}</Text>
          )}
          {/* Display the remaining category count */}
          <Text style={styles.remainingCategories}>
            Remaining Categories: {remainingCategories}
          </Text>
          <ScrollView style={styles.capsulesContainer}>
            {/* Wrap the displayed capsules with EditContainerCapsules */}
            {displayedCapsules.map((capsule, index) => (
              <ContainerEditCapsules key={capsule.id} capsuleId={capsule.id} onDelete={() => handleDelete(capsule.id)}>
                <Text>{capsule.capsule}</Text>
              </ContainerEditCapsules>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '100%', // Take up full width of modal
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      backgroundColor: '#ffffff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: '100%', // Take up full width of parent container
    },
    capsulesContainer: {
      maxHeight: 200, // Limit the height to ensure scrollability
      marginBottom: 10,
    },
    saveButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      width: '100%', // Take up full width of parent container
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    successMessage: {
      marginTop: 10,
      color: 'green',
    },
    selectedCategory: {
      marginBottom: 10,
      fontWeight: 'bold',
    },
    remainingCategories: {
      marginTop: 10,
      fontWeight: 'bold',
    },
  });

  export default QuickAddThoughtOld;
