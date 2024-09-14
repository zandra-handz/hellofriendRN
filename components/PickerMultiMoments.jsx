import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';  
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonMomentHelloes from '../components/ButtonMomentHelloes';

const PickerMultiMoments = ({ 
    onMomentSelect, 
    containerText = 'Moments shared',
    showAllCategories = true, 
    showInModal = true, 
}) => {
  const { themeStyles } = useGlobalStyle();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);  
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionPercentage, setSelectionPercentage] = useState(0); // State for selection percentage

  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList, preAddedTracker } = useCapsuleList();

  useEffect(() => {
    if (capsuleList.length > 0) {
      const totalCount = capsuleList.length;
      const selectedCount = selectedMoments.length;
      const percentage = calculatePercentage(selectedCount, totalCount);
      setSelectionPercentage(percentage);
      
    }
    if (selectedFriend) {
      setSelectedCategory(null);
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData, capsuleList, selectedMoments]);

  useEffect(() => { 
    console.log('Use effect to set moments when preAddedTracker updates');
    const initialSelectedMoments = capsuleList.filter(capsule => preAddedTracker.includes(capsule.id));
    setSelectedMoments(initialSelectedMoments);

  }, [preAddedTracker]);


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

  const calculatePercentage = (selectedCount, totalCount) => {
    return totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;
  };

  useEffect(() => {
    if (onMomentSelect) {
      onMomentSelect(selectedMoments);
    }
  }, [selectedMoments]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <View style={styles.container}>
      <Text style={[styles.selectedItemsTitle, themeStyles.subHeaderText]}>
        {containerText} ({selectionPercentage}%)
      </Text>
      <View style={styles.selectionContainer}>
          <Text style={[styles.title, themeStyles.genericText]}>Select from:</Text>
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
        </View>
          
      <View style={styles.contentContainer}> 
        <View style={[styles.selectedItemsContainer, themeStyles.genericTextBackgroundShadeTwo]}> 
          <FlatList
            data={selectedMoments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <ButtonMomentHelloes  
                  moment={item}
                  iconSize={26}
                  size={14}
                  color={'black'}
                  disabled={true}
                  sameStyleForDisabled={true}
                />
              </View>
            )}
            ListEmptyComponent={() => <Text style={styles.noItemsText}>No items selected</Text>}
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
              <FlatList
                data={categoryItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={selectedMoments.includes(item)}
                      onPress={() => handleCheckboxChange(item)}
                      containerStyle={{ margin: 0, padding: 0 }}
                    />
                    <Text style={styles.itemText}>{item.capsule}</Text>  
                  </View>
                )}
              />
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
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  selectedItemsContainer: {
    marginBottom: 10, 
    height: 200, 
    padding: 10, 
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'dimgray',
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
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
