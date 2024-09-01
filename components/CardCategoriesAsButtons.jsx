import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Button } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonSingleInput from '../components/ButtonSingleInput';

const DOUBLE_PRESS_DELAY = 300; // Time delay to detect double press

const CardCategoriesAsButtons = ({ onCategorySelect, showAllCategories = false, showInModal = true }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [newCategoryEntered, setNewCategoryEntered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const lastPress = useRef(0);

  useEffect(() => {
    if (selectedFriend) {
      setSelectedCategory(null); // Reset selectedCategory when selectedFriend changes
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData]);

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

    capsuleList.forEach(capsule => {
      const category = capsule.typedCategory;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });

    const maxCount = Math.max(...Object.values(categoryCounts));
    const mostCapsulesCategories = Object.keys(categoryCounts).filter(category => categoryCounts[category] === maxCount);

    return mostCapsulesCategories[Math.floor(Math.random() * mostCapsulesCategories.length)];
  };

  useEffect(() => {
    const uniqueCategories = [...new Set(capsuleList.map(capsule => capsule.typedCategory))];
    setCategories(uniqueCategories);

    if (uniqueCategories.length > 0) {
      const mostCapsulesCategory = getMostCapsulesCategory();
      if (mostCapsulesCategory) {
        const categoryIndex = uniqueCategories.indexOf(mostCapsulesCategory);
        setSelectedCategory(categoryIndex);
      }
    }
  }, [capsuleList]);

  useEffect(() => {
    if (onCategorySelect) {
      if (selectedCategory === null) {
        console.log('Please enter a category');
        onCategorySelect(null, []);
      } else {
        const category = categories[selectedCategory];
        const capsulesForCategory = capsuleList.filter(capsule => capsule.typedCategory === category);
        onCategorySelect(category, capsulesForCategory);
        console.log('Selected category:', category);
        console.log('Capsules for selected category:', capsulesForCategory);
      }
    }
  }, [selectedCategory, showAllCategories, categories]);

  const handleCategoryPress = (categoryIndex) => {
    const now = Date.now();
    const isDoublePress = now - lastPress.current < DOUBLE_PRESS_DELAY;
    lastPress.current = now;

    if (isDoublePress) {
      // Double press detected
      setSelectedCategory(categoryIndex);
      setModalVisible(true);
    } else {
      // Single press detected
      const category = categories[categoryIndex];
      const capsulesForCategory = capsuleList.filter(capsule => capsule.typedCategory === category);
      
      console.log('Clicked category index:', categoryIndex);
      console.log('Category name:', category);
      console.log('Capsules for category:', capsulesForCategory);
      setSelectedCategory(categoryIndex);
    }
  };

  const handleAllCategoriesPress = () => {
    console.log('Clicked All Categories');
    console.log('All capsules:', capsuleList);
    setSelectedCategory(null);
  };

  const handleInputValueChange = (inputValue) => {
    setSelectedCategory(inputValue);
    console.log('Received input value from ButtonSingleInput:', inputValue);
  };

  const handleNewCategory = (newCategory) => { 
    const updatedCategories = categories.length > 0 
      ? [...categories.slice(0, -1), newCategory] 
      : [newCategory];
  
    setCategories(updatedCategories);
    setSelectedCategory(updatedCategories.length - 1); 
    onCategorySelect(newCategory, []);  
    setNewCategoryEntered(true);
  };
  
  const renderCapsules = () => {
    if (selectedCategory === null) {
      return capsuleList.map((capsule, index) => (
        <Text key={index} style={styles.capsulesText}>
          {capsule.capsule}
        </Text>
      ));
    } else {
      return capsuleList.filter(capsule => capsule.typedCategory === categories[selectedCategory])
        .map((capsule, index) => (
          <Text key={index} style={styles.capsulesText}>
            {capsule.capsule}
          </Text>
        ));
    }
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
              numberOfLines={1} // Ensures text is on a single line
              ellipsizeMode='end' // Adds ellipsis at the end if text overflows
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
              onLongPress={() => handleCategoryPress(index)} // For testing
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === index && styles.selectedCategoryText
                ]}
                numberOfLines={1} // Ensures text is on a single line
                ellipsizeMode='end' // Adds ellipsis at the end if text overflows
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
      {!showInModal && (
        <View style={styles.capsulesContainer}>
          <ScrollView> 
            {renderCapsules()}
          </ScrollView>
        </View>
      )}
      {showInModal && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView> 
                {renderCapsules()}
              </ScrollView>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 0, 
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
    maxWidth: 120, // Set the max width of the button
    overflow: 'hidden', // Ensures text does not overflow the button
  },
  selectedCategoryButton: {
    backgroundColor: '#d4edda',
  },
  categoryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'black',
    // Ensure text does not wrap
    textAlign: 'center',
    overflow: 'hidden',
  },
  selectedCategoryText: {
    color: '#155724',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  noCategoriesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    width: '100%',
  },
  capsulesContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  capsulesText: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default CardCategoriesAsButtons;
