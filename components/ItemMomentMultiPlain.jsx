import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';

import { View, StyleSheet, Text, FlatList, Animated, Alert } from 'react-native';
import ButtonMomentCategorySmall from '../components/ButtonMomentCategorySmall';
import ButtonMoment from '../components/ButtonMoment'; 
import ButtonCheckboxControl from '../components/ButtonCheckboxControl';
import ItemViewMoment from '../components/ItemViewMoment';
import { CheckBox } from 'react-native-elements';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { updateThoughtCapsules } from '../api';
import LoadingPage from '../components/LoadingPage';
 
const footerHeight = 670; // Set to a fixed height for footer

const ItemMomentMultiPlain = ({
  passInData = false, 
  triggerUpdate = false,
  includeCategoryTitle = false, 
  parentCheckboxesTracker,
  parentChangesTracker,
  checkForChangesTrigger,
  navigation,
}) => { 
  const { themeStyles } = useGlobalStyle();
  const { capsuleList, sortedByCategory, categoryNames, categoryStartIndices, preAddedTracker, updatePreAdded, updateCapsules } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();
  const { calculatedThemeColors } = useSelectedFriend();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0]);
  const [showCheckboxes, setShowCheckboxes] = useState(passInData);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [selectedMomentsAlreadySaved, setSelectedMomentsAlreadySaved] = useState([]);

  const flatListRef = useRef(null);
  const categoryFlatListRef = useRef(null);
  const [categoryButtonPressed, setCategoryButtonPressed] = useState(false);
  const timerRef = useRef(null);

  const [isMakingCall, setIsMakingCall] = useState(false);
 

  
  const moments = sortedByCategory;

  useEffect(() => {
     setSelectedCategory(categoryNames[0]);
  }, []);

  useEffect(() => { 
    console.log('Use effect to set moments when preAddedTracker updates');
    const initialSelectedMoments = capsuleList.filter(capsule => preAddedTracker.includes(capsule.id));
    setSelectedMoments(initialSelectedMoments);
    setSelectedMomentsAlreadySaved(initialSelectedMoments);

  }, [preAddedTracker]);


  const checkForChanges = (selectedMoments, selectedMomentsAlreadySaved) => {
    const selectedMomentIds = selectedMoments.map(moment => moment.id);
    const selectedMomentsSet = new Set(selectedMomentIds);
  
    const selectedMomentAlreadySavedIds = selectedMomentsAlreadySaved.map(moment => moment.id);
    const selectedMomentsAlreadySavedSet = new Set(selectedMomentAlreadySavedIds);
  
    // Symmetric difference implementation
    const symmetricDifference = (setA, setB) => {
      const difference = new Set(setA);
      for (let elem of setB) {
        if (difference.has(elem)) {
          difference.delete(elem);
        } else {
          difference.add(elem);
        }
      }
      return difference;
    };
  
    const resultSymmetricDifference = symmetricDifference(selectedMomentsSet, selectedMomentsAlreadySavedSet);
    
    const hasChanges = resultSymmetricDifference.size > 0;
    console.log('difference: ', resultSymmetricDifference);
    console.log('hasChanges: ', hasChanges);

    parentChangesTracker(hasChanges);
    
    return hasChanges; // Return the result
  };
  

  useEffect(() => {  
        const hasChanges = checkForChanges(selectedMoments, selectedMomentsAlreadySaved);
        parentChangesTracker(hasChanges);
        console.log('trigger in child triggered!');
        console.log(hasChanges);
  
}, [checkForChangesTrigger]); 

  useEffect(() => {
    if (triggerUpdate) {
        handlePreSave(); // Call your save function here when triggered
    }
}, [triggerUpdate]);

useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    const hasChanges = checkForChanges(selectedMoments, selectedMomentsAlreadySaved);

    if (showCheckboxes && hasChanges) {
      // Prevent the default behavior of leaving the screen
      e.preventDefault();

      // Show the alert
      Alert.alert(
        '',
        'Do you want to save your changes?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: async () => {
              handleToggleNoSave();
              navigation.dispatch(e.data.action);
            },
          },
          {
            text: 'OK',
            onPress: async () => {
              await handleToggleSave();
              navigation.dispatch(e.data.action); // Navigate after saving
            },
          },
        ]
      );
    } else {
      setShowCheckboxes(prev => !prev);
      parentCheckboxesTracker();
    }
  });

  return unsubscribe; // Cleanup
}, [navigation, selectedMoments, selectedMomentsAlreadySaved, showCheckboxes]);

// Timer cleanup
useEffect(() => {
  return () => clearTimeout(timerRef.current);
}, []);


useEffect(() => {
  console.log(selectedCategory);

}, [selectedCategory]);


  const handleToggleCategory = (category) => {
    setCategoryButtonPressed(true);
    setSelectedCategory(prev => (prev === category ? null : category));
    const startIndex = categoryStartIndices[category];
    if (startIndex !== undefined) {
      console.log('startIndex: ', startIndex);
      flatListRef.current?.scrollToIndex({ index: startIndex, animated: true });

      const categoryIndex = Object.keys(categoryStartIndices).indexOf(category);
      categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
    }
    setCategoryButtonPressed(false);
  };

  const DELAY = 0; //previously when using flatlist for moments: 64

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (viewableItems.length > 0 && !categoryButtonPressed) {
      const visibleCategory = moments.find(moment => viewableItems.some(viewable => viewable.item.id === moment.id))?.typedCategory;

      if (visibleCategory) {
        timerRef.current = setTimeout(() => {
          setSelectedCategory(visibleCategory); 

          const categoryIndex = Object.keys(categoryStartIndices).indexOf(visibleCategory);
          if (categoryIndex !== -1 && !categoryButtonPressed) {
            categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
          }
        }, DELAY);
      }
    }
  }, [moments, categoryStartIndices, categoryButtonPressed]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  const openModal = (moment) => {
    setSelectedMoment(moment);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMoment(null);
    setIsModalVisible(false);
  };

  

  const handleToggleCheckboxes = () => {
    console.log(showCheckboxes);

    // Call checkForChanges to determine if there are any changes
    const hasChanges = checkForChanges(selectedMoments, selectedMomentsAlreadySaved);

    if (showCheckboxes && hasChanges) { 
      Alert.alert(
        '',  
        'Do you want to save your changes?',  
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => handleToggleNoSave(), // Optional action for cancel
          },
          {
            text: 'OK',
            onPress: () => handleToggleSave(), // Optional action for OK
          },
        ]
      );
    } else {
      setShowCheckboxes(prev => !prev);
      parentCheckboxesTracker();
    }
};

  
  const handleToggleNoSave = () => {
    setSelectedMoments(selectedMomentsAlreadySaved);
    setShowCheckboxes(prev => !prev);
    parentCheckboxesTracker();

  };


  const handleToggleSave = async () => {
    await handlePreSave(); // Make sure handlePreSave finishes before proceeding
    // Any additional actions that should occur after pre-save is complete
    
    setShowCheckboxes(prev => !prev);
    parentCheckboxesTracker();
  };
 

  const handlePreSave = async () => {
    // Check if there are no selected moments
    setIsMakingCall(true);
    if (selectedMoments.length === 0) {
        console.log('No moments selected to update.');
        return; // Early return or you can handle this case differently
    }

    const selectedIds = new Set(selectedMoments.map(moment => moment.id));

    const capsulesToUpdate = selectedMoments.map(moment => ({
        id: moment.id,
        fieldsToUpdate: { pre_added_to_hello: true }
    }));

    const idsToUpdateFalse = preAddedTracker.filter(id => !selectedIds.has(id));
    const idsToUpdateTrue = selectedMoments.map(moment => moment.id);

    const capsulesToUpdateFalse = idsToUpdateFalse.map(id => ({
        id: id,
        fieldsToUpdate: { pre_added_to_hello: false }
    }));

    const allCapsulesToUpdate = [...capsulesToUpdate, ...capsulesToUpdateFalse];

    try {
        const updatedData = await updateThoughtCapsules(selectedFriend.id, allCapsulesToUpdate);

        updatePreAdded(idsToUpdateTrue, idsToUpdateFalse);



    } catch (error) {
        console.error('Error during pre-save:', error);
    }
    setIsMakingCall(false);
};

  

  const toggleSelectMoment = (moment) => {
    const updatedSelectedMoments = selectedMoments.includes(moment)
      ? selectedMoments.filter((m) => m !== moment)
      : [...selectedMoments, moment];
      console.log('updating selected moments!');
    setSelectedMoments(updatedSelectedMoments);
  };

  const renderMomentItem = ({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);
    const isHighlighted = moment.typedCategory === selectedCategory;
  
    return (
      <View style={[styles.momentContainer, isHighlighted && styles.highlightedMoment, {backgroundColor: calculatedThemeColors.lightColor}]}>
        {showCheckboxes && (
          <CheckBox
            key={moment.id}
            checked={isSelected}
            onPress={() => toggleSelectMoment(moment)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor={themeStyles.genericText.color} // Set checked color here
            uncheckedColor={calculatedThemeColors.darkColor} 
          />
        )}
        <Animated.View style={[styles.momentContent, !isHighlighted && styles.fadedOut]}>
          <ButtonMoment
            moment={moment}
            onPress={() => openModal(moment)}
            disabled={false}
            sameStyleForDisabled={true}
          />
          {includeCategoryTitle && (
            <View style={styles.categoryCircle}>
              <Text style={styles.categoryText}>{moment.typedCategory}</Text>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}> 
      <ButtonCheckboxControl 
        onToggleCheckboxes={handleToggleCheckboxes}
        showCheckboxes={showCheckboxes} 
        selectedMoments={selectedMoments}
        isSaving={isMakingCall}
        onSave={handlePreSave}
        buttonColor={calculatedThemeColors.lightColor}
      
      />

      <View style={styles.categoryButtonsContainer}>

      {categoryStartIndices && moments && (
 
      <FlashList
        ref={categoryFlatListRef}
        data={Object.keys(categoryStartIndices)}
        renderItem={({ item: category }) => (
          <View style={{width: 110,  height: 40, paddingRight: 10, position: 'relative'}}>
          <ButtonMomentCategorySmall
            key={category}
            onPress={() => handleToggleCategory(category)}
            categoryText={category}
            momentCount={moments.filter(moment => moment.typedCategory === category).length}
            highlighted={category === selectedCategory}
          />
          
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={200}   
        contentContainerStyle={{ paddingRight: 300 }}
      /> 
      )}
    </View> 
      

      <View style={styles.contentContainer}> 
        <View style={styles.loadingContainer}>
         
        <LoadingPage 
        loading={isMakingCall}  
        color={calculatedThemeColors.lightColor}
        spinnerType='swing'
        /> 
         </View> 
        {!isMakingCall && selectedCategory && ( 
        <FlashList
            ref={flatListRef}  // Attach the ref to FlashList
            data={moments}  // Your data source
            renderItem={renderMomentItem}  // Render each item
            extraData={{ selectedCategory, selectedMoments, showCheckboxes }}
            keyExtractor={(item) => item.id.toString()}  // Ensure unique keys
            numColumns={1}  // Single column
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}  // Adjust the item size based on your content
            ListFooterComponent={() => <View style={{ height: footerHeight }} />}  // Optional footer
            onViewableItemsChanged={handleViewableItemsChanged}  // Handle viewable items
            viewabilityConfig={viewabilityConfig}  // Viewability configuration
            scrollEventThrottle={16}  // Throttle the scroll event for performance
          />
        )}
        
      </View>

      {isModalVisible && selectedMoment && (
        <ItemViewMoment
          isVisible={isModalVisible}
          onClose={closeModal}
          moment={selectedMoment}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 2,
    flex: 1,
    paddingHorizontal: 2,
    justifyContent: 'space-between',
  },
  categoryButtonsContainer: {
    minHeight: 2,
    paddingHorizontal: 14, 
    borderWidth: 1,
    width: '100%',
    borderRadius: 30,
    paddingVertical: 10,
    borderColor: 'black',
    backgroundColor: 'black',
    marginBottom: 10,
  },
  contentContainer: { 
    height: '100%',
    width: '100%',
    alignContent: 'right',
    alignItems: 'right',
    justifyContent: 'flex-start',
  },
  momentContainer: {
    padding: 0,
    marginBottom: 8,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  loadingContainer: { 
      position: 'absolute',
      top: 90,
      width: '100%',
  },
  momentContent: {
    padding: 2,
  },
  fadedOut: {
    opacity: 0.5, // Adjust the faded effect here
  },
  categoryCircle: {
    borderRadius: 20,
    padding: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: 'black',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkboxText: {
    color: 'black',
  },
  highlightedMoment: { 
  },
  imageRow: {
    justifyContent: 'space-between',
  },
});

export default ItemMomentMultiPlain;
