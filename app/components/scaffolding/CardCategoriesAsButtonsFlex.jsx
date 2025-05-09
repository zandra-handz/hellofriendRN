import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useCapsuleList } from '@/src/context/CapsuleListContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import ButtonSingleInput from '../components/ButtonSingleInput';
import  { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';
import AlertFormSubmit from '../components/AlertFormSubmit';
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import AddOutlineSvg from '@/app/assets/svgs/add-outline.svg'; // Import the SVG


const DOUBLE_PRESS_DELAY = 300; // Time delay to detect double press

const CardCategoriesAsButtonsFlex = ({ onCategorySelect, momentTextForDisplay, onParentSave, showAllCategories = false, showInModal = true }) => {
  const { themeStyles } = useGlobalStyle();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ selectedCategoryCapsules, setSelectedCategoryCapsules ] = useState(null);
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { capsuleList, categoryCount, categoryNames } = useCapsuleList();
  const [categoryLimit, setCategoryLimit] = useState('');
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [newCategoryEntered, setNewCategoryEntered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const lastPress = useRef(0);

  useEffect(() => {
    if (selectedFriend) {
      setSelectedCategory(null);
       fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData]);
 

  const fetchCategoryLimitData = async () => {
    console.log('category names: ', categoryNames);
    console.log('category counts: ', categoryCount);
    try {
      if (friendDashboardData && friendDashboardData.length > 0) {
        const firstFriendData = friendDashboardData[0];
        const categoryLimitResponse = firstFriendData.suggestion_settings.category_limit_formula; 
        const categoryLimitValue = parseInt(categoryLimitResponse);
        setCategoryLimit(categoryLimitValue);
        setRemainingCategories(categoryLimit - categoryCount);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => {
    setRemainingCategories(categoryLimit - categoryCount); 

  }, [categoryCount, categoryLimit]);

  useEffect(() => {
    console.log('remaining categories updated: ', remainingCategories);

  }, [remainingCategories]);
 

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

    if (categoryCount > 0) {
      const mostCapsulesCategory = getMostCapsulesCategory(); 
      if (mostCapsulesCategory) {
     
        setSelectedCategory(mostCapsulesCategory);
      }
    }
  }, [capsuleList, categoryCount, categoryNames]);

  useEffect(() => {
    if (onCategorySelect) {
      if (selectedCategory === null) { 
        onCategorySelect(null, []);
      } else {
        const category = selectedCategory;
        const capsulesForCategory = capsuleList.filter(capsule => capsule.typedCategory === category);
        onCategorySelect(category, capsulesForCategory);

      }
    }
  }, [selectedCategory]);

  const handleCategoryPress = (category) => {
    const now = Date.now();
    const isDoublePress = now - lastPress.current < DOUBLE_PRESS_DELAY;
    lastPress.current = now;

    if (isDoublePress) { 
      onParentSave();
    } else {  
      setSelectedCategory(category);
      setModalVisible(true); 
      //console.log('Clicked category index:', category);
      //console.log('Category name:', category);
      //console.log('Capsules for category:', capsulesForCategory);
      
      setSelectedCategory(category);
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
    const updatedCategories = categoryCount > 0 
      ? [...categoryNames.slice(0, -1), newCategory] 
      : [newCategory];
   
    setSelectedCategory(newCategory); 
    onCategorySelect(newCategory, []);  
    setNewCategoryEntered(true);
  };


  useEffect(() => {
    if (newCategoryEntered) {
      onParentSave();
      setNewCategoryEntered(false);

    };

  }, [newCategoryEntered]);
  
  const renderCapsules = () => {
    if (selectedCategory === null) {
      return capsuleList.map((capsule, index) => (
        <Text key={index} style={styles.capsulesText}>
          {capsule.capsule}
        </Text>
      ));
    } else {
      return capsuleList.filter(capsule => capsule.typedCategory === selectedCategory)
        
      .map((capsule, index) => (
          <Text key={index} style={styles.capsulesText}>
            {capsule.capsule}
          </Text>
        ));
    }
  };

  useEffect(() => {
    setSelectedCategoryCapsules(capsuleList.filter(capsule => capsule.typedCategory === selectedCategory)
  );

  }, [selectedCategory]);

  useEffect(() => {

    console.log(selectedCategoryCapsules);

  }, [selectedCategoryCapsules]);

  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
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
              numberOfLines={1}  
              ellipsizeMode='end' 
            >
              All Categories
            </Text>
          </TouchableOpacity>
        )}
        {categoryCount === 0 ? (
          <Text style={styles.noCategoriesText}>Please enter a category</Text>
        ) : (
          categoryNames.map((category) => (
            <View key={category} style={{ paddingBottom: 12 }}>
              <ButtonColorBGSmall
                key={category}
                title={category}
                useLightColor={false}
                onPress={() => handleCategoryPress(category)}
                textStyle={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}
              />
            </View>
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
        <AlertFormSubmit
          isModalVisible={modalVisible}
          headerContent={
            <ThoughtBubbleOutlineSvg width={38} height={38} color={themeStyles.modalIconColor.color} />
          }
          questionIsSubTitle={false}
          questionText={`${momentTextForDisplay}`}
          onCancel={() => setModalVisible(false)}
          onConfirm={onParentSave}
          confirmText={'Add to category'}
          cancelText={'Back'}
          formHeight={430}
          formBody={
            <View style={styles.selectMomentListContainer}> 
           
              <View style={{height: 'auto', paddingBottom: 20, flexDirection: 'row', alignItems: 'center',alignContent: 'center', justifyContent: 'center'}}> 
              <AddOutlineSvg width={42} height={42} color={themeStyles.modalIconColor.color} />
          
</View>

              
              <View style={styles.momentModalContainer}>
              <Text style={[styles.momentModalTitle, themeStyles.subHeaderText]}>{selectedCategory}</Text>
              <FlatList
                data={selectedCategoryCapsules}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.momentCheckboxContainer}>
                  
                  <View style={styles.momentItemTextContainer}>
                    
                  <View style={{height: '100%'}}>
                    <View style={styles.checkboxContainer}>
                      <ThoughtBubbleOutlineSvg height={24} width={24} color={themeStyles.modalIconColor.color}/> 
                    </View>
                  </View>
                    <View style={{width: '86%'}}>
                    <Text style={[styles.momentItemText, themeStyles.genericText]}>{item.capsule}</Text>  
                    </View>
                    </View>
                  </View>
                )}
              />  
            </View>
          </View>


          }
        /> 
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    borderRadius: 10,
    padding: 0,
    borderWidth: 1, 
    padding: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-around', 
    marginBottom: 0, 
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
    color: 'white',
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

  selectMomentListContainer: {
    height: '92%',
    width: '100%',
    borderRadius: 20,
    borderTopRightWidth: .6,
    borderColor: 'darkgray', 

  },
  
  momentModalContainer: {
    width: '100%', 
    borderRadius: 10,
    padding: 0,
    alignItems: 'center',
  },
  momentModalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  momentCheckboxContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center', 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, 
    paddingTop: 4,
    paddingRight: 10,
  },
  momentItemTextContainer: {
    flexDirection: 'row', // Allows text to wrap
     // Ensures text wraps to the next line
    alignItems: 'flex-start', // Aligns text to the top
    marginBottom: 20,
    paddingBottom: 20, 
    width: '100%', // Takes full width of the container
    borderBottomWidth: .4, // Add bottom border
    borderBottomColor: '#fff', // White color for the border
  }, 
  newMomentItemTextContainer: {
    flexDirection: 'row', // Allows text to wrap
     // Ensures text wraps to the next line
    alignItems: 'flex-start', // Aligns text to the top
    marginBottom: 10,
    paddingBottom: 20, 
    maxHeight: 200,
    width: '100%',
    
  }, 
  momentItemText: {
    fontSize: 13, 
    fontFamily: 'Poppins-Regular', 
    width: '100%',
  },
  newMomentItemText: {
    fontSize: 20, 
    fontFamily: 'Poppins-Regular', 
    width: '100%',
  },
  momentModalContainer: {
    width: '100%', 
    borderRadius: 10,
    padding: 0,
    height: '96%',
    alignItems: 'center',
  },

});

export default CardCategoriesAsButtonsFlex;
