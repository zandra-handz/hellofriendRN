import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; // Adjust the import path as needed
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonSingleInput from '../components/ButtonSingleInput'; // Adjust the import path as needed

const CardCategoriesAsButtons = ({ onCategorySelect, showAllCategories = false }) => {
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList } = useCapsuleList(); // Assuming useCapsuleList provides the list of capsules
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState('');
  const [newCategoryEntered, setNewCategoryEntered ] = useState(false);

  useEffect(() => {
    if (selectedFriend) {
      setSelectedCategory(null); // Reset selectedCategory when selectedFriend changes
      fetchCategoryLimitData();
    }
  }, [selectedFriend]);

  useEffect(() => {

    if (newCategoryEntered) { 
        setRemainingCategories((parseInt(remainingCategories - 1)));
        setNewCategoryEntered(false);
    };
    
  }, [newCategoryEntered]);

  useEffect(() => {
    if (categoryLimit) {
        console.log(categoryLimit);
        console.log(remainingCategories);
    }
  }, [categoryLimit, remainingCategories]);

  const fetchCategoryLimitData = async () => {
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
    const uniqueCategories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setCategories(uniqueCategories);

    // Reset selectedCategory to null when categories are updated
    if (selectedCategory !== null && uniqueCategories.length > 0) {
      if (selectedCategory >= uniqueCategories.length) {
        setSelectedCategory(null);
      }
    }
  }, [capsuleList]);

  useEffect(() => {
    // Notify parent about the selected category whenever it changes
    if (onCategorySelect) {
      const category = selectedCategory === null
        ? (showAllCategories ? 'All Categories' : 'No Category')
        : categories[selectedCategory];
      const capsulesForCategory = selectedCategory === null
        ? capsuleList
        : capsuleList.filter(capsule => capsule.typedCategory === categories[selectedCategory]);
      onCategorySelect(category, capsulesForCategory);
      console.log('Selected category:', category);
      console.log('Capsules for selected category:', capsulesForCategory); // Log capsules
    }
  }, [selectedCategory, showAllCategories, categories]);

  const handleCategoryPress = (categoryIndex) => {
    const category = categories[categoryIndex];
    const capsulesForCategory = capsuleList.filter(capsule => capsule.typedCategory === category);
    
    console.log('Clicked category index:', categoryIndex);
    console.log('Category name:', category);
    console.log('Capsules for category:', capsulesForCategory); // Log capsules
    setSelectedCategory(categoryIndex);
  };

  const handleAllCategoriesPress = () => {
    console.log('Clicked All Categories');
    console.log('All capsules:', capsuleList); // Log all capsules when "All Categories" is clicked
    setSelectedCategory(null);
  };

  const handleInputValueChange = (inputValue) => {
    setSelectedCategory(inputValue);
    console.log('Received input value from ButtonSingleInput:', inputValue);
    // Handle the input value as needed
  };

  const handleNewCategory = (newCategory) => { 
    setCategories([...categories, newCategory]);
    setSelectedCategory(categories.length);  
    onCategorySelect(newCategory, []); // No capsules for new category yet
    setNewCategoryEntered(true);
    };

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        {showAllCategories && (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === null && styles.selectedCategoryButton
            ]}
            onPress={handleAllCategoriesPress}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.selectedCategoryText
              ]}
            >
              All Categories
            </Text>
          </TouchableOpacity>
        )}
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === index && styles.selectedCategoryButton
            ]}
            onPress={() => handleCategoryPress(index)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === index && styles.selectedCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
        {remainingCategories && (
          <ButtonSingleInput onInputValueChange={handleNewCategory} title={`Add new (${remainingCategories} left)`}/>
        )}
      </View>
      <View style={styles.capsulesContainer}>
        <ScrollView> 
          {selectedCategory === null ? (
            capsuleList.map((capsule, index) => (
              <Text key={index} style={styles.capsulesText}>
                {capsule.capsule}
              </Text>
            ))
          ) : (
            capsuleList.filter(capsule => capsule.typedCategory === categories[selectedCategory])
              .map((capsule, index) => (
                <Text key={index} style={styles.capsulesText}>
                  {capsule.capsule}
                </Text>
              ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  categoriesContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10, 
  },
  categoryButton: {
    padding: 10,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedCategoryButton: {
    backgroundColor: '#d4edda',
  },
  categoryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
  capsulesContainer: {
    marginTop: 0,
    height: 120,
    backgroundColor: 'pink',
  },
  capsulesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginVertical: 5,
  },
});

export default CardCategoriesAsButtons;
