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
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [newCategoryEntered, setNewCategoryEntered] = useState(false);

  useEffect(() => {
    if (selectedFriend) {
      setSelectedCategory(null); // Reset selectedCategory when selectedFriend changes
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData]);

  useEffect(() => {
    if (newCategoryEntered && remainingCategories) { 
      setRemainingCategories(parseInt(remainingCategories - 1));
      setNewCategoryEntered(false);
    }
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

  const getMostCapsulesCategory = () => {
    if (capsuleList.length === 0) return null;
    const categoryCounts = {};

    // Count capsules for each category
    capsuleList.forEach(capsule => {
      const category = capsule.typedCategory;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });

    // Find the maximum count
    const maxCount = Math.max(...Object.values(categoryCounts));
    const mostCapsulesCategories = Object.keys(categoryCounts).filter(category => categoryCounts[category] === maxCount);

    // Pick a random category from those with the maximum count
    return mostCapsulesCategories[Math.floor(Math.random() * mostCapsulesCategories.length)];
  };

  useEffect(() => {
    const uniqueCategories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setCategories(uniqueCategories);

    // Automatically select the category with the most capsules
    if (uniqueCategories.length > 0) {
      const mostCapsulesCategory = getMostCapsulesCategory();
      if (mostCapsulesCategory) {
        const categoryIndex = uniqueCategories.indexOf(mostCapsulesCategory);
        setSelectedCategory(categoryIndex);
      }
    }
  }, [capsuleList]);

  useEffect(() => {
    // Notify parent about the selected category whenever it changes
    if (onCategorySelect) {
      if (selectedCategory === null) {
        console.log('Please enter a category');
        // Handle no category situation
        onCategorySelect(null, []);
      } else {
        const category = categories[selectedCategory];
        const capsulesForCategory = capsuleList.filter(capsule => capsule.typedCategory === category);
        onCategorySelect(category, capsulesForCategory);
        console.log('Selected category:', category);
        console.log('Capsules for selected category:', capsulesForCategory); // Log capsules
      }
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
    // Check if there's already a new category (i.e., the last item in the categories array)
    const updatedCategories = categories.length > 0 
      ? [...categories.slice(0, -1), newCategory] // Replace the last category
      : [newCategory]; // If no categories yet, just add the new one
  
    setCategories(updatedCategories);
    setSelectedCategory(updatedCategories.length - 1); // Set the index to the new category
    
    onCategorySelect(newCategory, []);  
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
        {categories.length === 0 ? (
          <Text style={styles.noCategoriesText}>Please enter a category</Text>
        ) : (
          categories.map((category, index) => (
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
          ))
        )}
        {remainingCategories !== null && remainingCategories > 0 && (
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
  noCategoriesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'red',
    marginVertical: 10,
  },
});

export default CardCategoriesAsButtons;
