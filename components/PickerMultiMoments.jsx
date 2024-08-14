import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, FlatList, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements'; // For checkboxes
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonMoment from '../components/ButtonMoment';

const PickerMultiMoments = ({ 
    onMomentSelect, 
    containerText='Moments shared',
    showAllCategories = true, 
    showInModal = true,
    singleLineScroll = false // New prop to control single line scroll
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]); // For selected checkboxes
  const [categoryItems, setCategoryItems] = useState([]); // For items under selected category
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionPercentage, setSelectionPercentage] = useState(0); // State for selection percentage

  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();

  useEffect(() => {
    // Calculate and log percentage
    if (capsuleList.length > 0) {
      const totalCount = capsuleList.length;
      const selectedCount = selectedMoments.length;
      const percentage = calculatePercentage(selectedCount, totalCount);
      setSelectionPercentage(percentage);
    }

    // Log the total number of items in capsuleList
    console.log('Total Number of Items in Capsule List:', capsuleList.length);

    if (selectedFriend) { 
      setSelectedCategory(null);  
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData, capsuleList, selectedMoments]);

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
  }, [capsuleList]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const items = capsuleList.filter(capsule => capsule.typedCategory === category);
    setCategoryItems(items);
    console.log('Total Number of Items in Selected Category:', items.length); // Log number of items in selected category
    if (showInModal) {
      setModalVisible(true);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedMoments(prevSelectedMoments => {
      const isItemSelected = prevSelectedMoments.includes(item);
      const updatedSelection = isItemSelected
        ? prevSelectedMoments.filter(selectedItem => selectedItem !== item)
        : [...prevSelectedMoments, item];

      // Log the updated selection, count of selected items, and percentage
      console.log('Updated Selected Moments:', updatedSelection);
      console.log('Number of Selected Items:', updatedSelection.length);
      console.log('Percentage of Selected Items:', calculatePercentage(updatedSelection.length, capsuleList.length));

      return updatedSelection;
    });
  };

  // Function to calculate the percentage
  const calculatePercentage = (selectedCount, totalCount) => {
    return totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;
  };

  useEffect(() => {
    if (onMomentSelect) {
      onMomentSelect(selectedMoments);
    }
  }, [selectedMoments]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5); // Example limit for demonstration

  return (
    <View style={styles.container}>
      <Text style={styles.selectedItemsTitle}>
        {containerText} ({selectionPercentage}%)
      </Text>
          
      <View style={styles.contentContainer}> 
        <View style={styles.selectedItemsContainer}> 
          <ScrollView> 
            {selectedMoments.length > 0 ? (
              selectedMoments.map((item, index) => (
                <View key={index} style={styles.itemContainer}> 
                  <ButtonMoment  
                    moment={item}
                    iconSize={26}
                    size={14}
                    color={'black'}
                    disabled={true}
                    sameStyleForDisabled={true}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items selected</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.selectionContainer}>
          <Text style={styles.title}>Select from:</Text>
          <FlatList
            data={visibleCategories}
            horizontal={true} // Enable horizontal scrolling
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryButton} 
                onPress={() => handleCategoryPress(item)}
              >
                <Text style={styles.categoryButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
            showsHorizontalScrollIndicator={false} // Hide scroll indicator for better UX
          />
        </View>
 
      </View>

      {showInModal && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedCategory}</Text>
              <ScrollView>
                {categoryItems.map((item, index) => (
                  <View key={index} style={styles.checkboxContainer}>
                    <CheckBox
                      checked={selectedMoments.includes(item)}
                      onPress={() => handleCheckboxChange(item)}
                      containerStyle={{ margin: 0, padding: 0 }}
                    />
                    <Text style={styles.itemText}>{item.capsule}</Text>  
                  </View>
                ))}
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
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 0,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  selectedItemsContainer: {
    marginBottom: 10,
    backgroundColor: 'lightgray',
    padding: 10,
    height: 300, // Ensure this height is sufficient for scrolling
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  selectedItemText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  categoryButton: {
    backgroundColor: '#f0f0f0', // Adjust as needed to match the original
    paddingVertical: 6, // Adjust padding for better button height
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000', // Add shadow for button elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default PickerMultiMoments;
