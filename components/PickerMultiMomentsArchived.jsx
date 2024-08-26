import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, FlatList, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonMomentHelloes from '../components/ButtonMomentHelloes';

const PickerMultiMomentsArchived = ({ 
    onMomentSelect, 
    archivedMoments,
    containerText = 'Reuse moments ',
    showAllCategories = true, 
    showInModal = true,
    singleLineScroll = false,
    onCancel // Add this prop
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();

  useEffect(() => {
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
    const uniqueCategories = [...new Set(archivedMoments.map(moment => moment.typed_category))];
    setCategories(uniqueCategories);
  }, [archivedMoments]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const items = archivedMoments.filter(moment => moment.typed_category === category);
    setCategoryItems({ [category]: items });
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
      return updatedSelection;
    });
  };

  useEffect(() => {
    if (onMomentSelect) {
      onMomentSelect(selectedMoments);
    }
  }, [selectedMoments]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  const handleViewAllMoments = () => {
    setSelectedCategory('All Moments');

    const groupedMoments = archivedMoments.reduce((groups, moment) => {
      const category = moment.typed_category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(moment);
      return groups;
    }, {});

    setCategoryItems(groupedMoments);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.selectedItemsTitle}>
          {containerText} ({selectedMoments.length} selected)
        </Text>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.title}>Add from:</Text>
        <FlatList
          data={visibleCategories}
          horizontal={true}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.categoryButton} 
              onPress={() => handleCategoryPress(item)}
            >
              <Text style={styles.categoryButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={handleViewAllMoments}
        >
          <Text style={styles.viewAllButtonText}>All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}> 
        <View style={styles.selectedItemsContainer}> 
          <ScrollView> 
            {selectedMoments.length > 0 ? (
              selectedMoments.map((item, index) => (
                <View key={index} style={styles.itemContainer}> 
                  <ButtonMomentHelloes  
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
                {Object.keys(categoryItems).map((category, index) => (
                  <View key={index} style={styles.categoryGroupContainer}>
                    <Text style={styles.categoryGroupTitle}>{category}</Text>
                    {categoryItems[category] && categoryItems[category].map((item, idx) => (
                      <View key={idx} style={styles.checkboxContainer}>
                        <CheckBox
                          checked={selectedMoments.includes(item)}
                          onPress={() => handleCheckboxChange(item)}
                          containerStyle={{ margin: 0, padding: 0 }}
                        />
                        <Text style={styles.itemText}>{item.capsule}</Text>  
                      </View>
                    ))}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
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
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  viewAllButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    margin: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  categoryGroupContainer: {
    marginBottom: 10,
  },
  categoryGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default PickerMultiMomentsArchived;
