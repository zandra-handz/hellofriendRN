import React, { useEffect, useState, useRef, useCallback } from 'react';

import { View, StyleSheet, Text,TouchableOpacity, Animated, Alert } from 'react-native';
import ButtonMomentCategorySmall from '../components/ButtonMomentCategorySmall';
import ButtonMoment from '../components/ButtonMoment'; 
import ButtonCheckboxControl from '../components/ButtonCheckboxControl';
import ItemViewMoment from '../components/ItemViewMoment';
import { CheckBox } from 'react-native-elements';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { useFriendList } from '../context/FriendListContext';
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import SpinOutlineSvg from '../assets/svgs/spin-outline.svg';

import LoadingPage from '../components/LoadingPage';
import SearchBar from '../components/SearchBar';

import { Dimensions } from 'react-native';

 
const footerHeight = 720; // Set to a fixed height for footer

const MomentsList = ({
  passInData = false,  
  includeCategoryTitle = false, 
  parentCheckboxesTracker,
  parentChangesTracker,
  checkForChangesTrigger,
  navigation,
}) => { 
  const { themeStyles } = useGlobalStyle();
  const { capsuleList, preAdded, categoryNames, categoryStartIndices, preAddedTracker, momentsSavedToHello, updateCapsules } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();  
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0]);
  const [showCheckboxes, setShowCheckboxes] = useState(passInData);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [selectedMomentsAlreadySaved, setSelectedMomentsAlreadySaved] = useState([]);

  const [ tempSelectedMoment, setTempSelectedMoment ] = useState(null);
  const flatListRef = useRef(null);
  const categoryFlatListRef = useRef(null);
  const [categoryButtonPressed, setCategoryButtonPressed] = useState(false);
  const timerRef = useRef(null);

  const [isMakingCall, setIsMakingCall] = useState(false);
 
 
  
  const moments = (capsuleList);
 
  useEffect(() => {  
     
    const initialSelectedMoments = capsuleList.filter(capsule => preAdded.includes(capsule.id));
    
    setSelectedMoments(initialSelectedMoments); 
    setSelectedMomentsAlreadySaved(initialSelectedMoments);

  }, [preAddedTracker, capsuleList]);


  const checkForChanges = (selectedMoments, selectedMomentsAlreadySaved) => {
    const selectedMomentIds = selectedMoments.map(moment => moment.id);
    const selectedMomentsSet = new Set(selectedMomentIds);
  
    const selectedMomentAlreadySavedIds = selectedMomentsAlreadySaved.map(moment => moment.id);
    const selectedMomentsAlreadySavedSet = new Set(selectedMomentAlreadySavedIds);
   
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
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {

    if (showCheckboxes && momentsToUpdate.length > 0) {
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
}, [navigation, selectedMoments, momentsToUpdate, selectedMomentsAlreadySaved, showCheckboxes]);

// Timer cleanup
useEffect(() => {
  return () => clearTimeout(timerRef.current);
}, []);


const handleScrollToItem = (moment) => {
  const itemIndex = moment.uniqueIndex;
  if (itemIndex !== undefined) {
    flatListRef.current?.scrollToIndex({ index: itemIndex, animated: true });


  }

  console.log(moment);

};

const handleScrollToRandomItem = () => {
  const itemIndex = Math.floor(Math.random() * moments.length);
  if (itemIndex !== undefined) {
    flatListRef.current?.scrollToIndex({ index: itemIndex, animated: true });


  }

};

 


  const handleToggleCategory = (category) => {
    setCategoryButtonPressed(true);
    setSelectedCategory(prev => (prev === category ? null : category));
    const startIndex = categoryStartIndices[category];
    if (startIndex !== undefined) { 
      flatListRef.current?.scrollToIndex({ index: startIndex, animated: true });

      const categoryIndex = Object.keys(categoryStartIndices).indexOf(category);
      categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
    }
    setCategoryButtonPressed(false);
  };


  useEffect(() => {

    console.log(tempSelectedMoment);
  }, [tempSelectedMoment]);


  const DELAY = 0; //previously when using flatlist for moments: 64

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    // Immediately set the tempSelectedMoment without a delay
    if (viewableItems.length > 0) {
      const firstViewableItem = viewableItems[0].item;
      if (firstViewableItem && firstViewableItem.id !== tempSelectedMoment) {
        setTempSelectedMoment(firstViewableItem.id); // Update state instantly
      }
    }
  
    // Check for category changes without the timer, update immediately
    if (viewableItems.length > 0 && !categoryButtonPressed) {
      const visibleCategory = moments.find(moment => 
        viewableItems.some(viewable => viewable.item.id === moment.id)
      )?.typedCategory;
  
      if (visibleCategory) {
        setSelectedCategory(visibleCategory);
        const categoryIndex = Object.keys(categoryStartIndices).indexOf(visibleCategory);
        if (categoryIndex !== -1) {
          categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
        }
      }
    }
  }, [moments, categoryStartIndices, categoryButtonPressed, tempSelectedMoment]);
  
  

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const openModal = (moment) => {
    if (!showCheckboxes) {
    setSelectedMoment(moment);
    setIsModalVisible(true);
    } else {
      toggleSelectMoment(moment);
    }
  };
 

  const closeModal = () => {
    setSelectedMoment(null);
    setIsModalVisible(false);
  };

  

  const handleToggleCheckboxes = () => {
    console.log(showCheckboxes);

    
    if (showCheckboxes && momentsToUpdate.length > 0) { 
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
 

 

    if (momentsToUpdate.length === 0) {
      console.log('No moments selected to update.');
      return; // Early return or you can handle this case differently
   }
   setIsMakingCall(true);

    try {
         updateCapsules(momentsToUpdate);

         setMomentsToUpdate([]);
         



    } catch (error) {
        console.error('Error during pre-save:', error);
    }
    setIsMakingCall(false);
    

}; 

const [momentsToUpdate, setMomentsToUpdate] = useState([]);

const toggleSelectMoment = (moment) => {
  // Check if the moment id is already in momentsToUpdate
  const updatedMomentsToUpdate = momentsToUpdate.some((m) => m.id === moment.id)
    ? momentsToUpdate.filter((m) => m.id !== moment.id)  // Deselect: remove the moment by id
    : [
        ...momentsToUpdate,
        {
          id: moment.id, 
          fieldsToUpdate: { pre_added_to_hello: !moment.pre_added_to_hello }, // Toggle the pre_added_to_hello value
        }
      ];  // Select: add the moment with the toggled pre_added_to_hello

  console.log('updating momentsToUpdate!');
  setMomentsToUpdate(updatedMomentsToUpdate);
  const updatedSelectedMoments = selectedMoments.includes(moment)
  ? selectedMoments.filter((m) => m !== moment)
  : [...selectedMoments, moment];
  console.log('updating selected moments!');
setSelectedMoments(updatedSelectedMoments);
};


 

  const renderMomentItem = ({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);
    const isHighlighted = moment.typedCategory === selectedCategory;
    const isTemp = moment.id === tempSelectedMoment;
    

  
    return (
      <View style={[styles.momentContainer, isHighlighted && styles.highlightedMoment, {backgroundColor: themeAheadOfLoading.lightColor}]}>
        {showCheckboxes && (
          <CheckBox
            key={moment.id}
            checked={isSelected}
            onPress={() => toggleSelectMoment(moment)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor={themeAheadOfLoading.lightColor} // Set checked color here
            uncheckedColor={themeStyles.genericTextBackgroundShadeTwo.color} 
            size={24} 
          />
        )}
        <Animated.View style={[styles.momentContent, (isHighlighted && !isTemp) && styles.partiallyFadedOut, (!isTemp && !isHighlighted) && styles.fadedOut, isTemp && styles.tempSelected]}>
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
      <View style={[styles.searchBarContent, {marginTop: '1%'}]}>
      
        
      <TouchableOpacity style={{alignContent: 'center', marginHorizontal: '1%', alignItems: 'center', flexDirection: 'row'}} onPress={handleScrollToRandomItem}>
        <SpinOutlineSvg height={26} width={26} color={themeAheadOfLoading.fontColorSecondary}/>
        <Text style={[styles.randomButtonText, {color: themeAheadOfLoading.fontColorSecondary}]}></Text>
      </TouchableOpacity> 
      <View style={{width: '40%', flexDirection: 'row', alignContent: 'center', alignItems: 'center', height: 'auto' }}>
          <SearchBar data={moments} borderColor={'transparent'} onPress={handleScrollToItem} searchKeys={['capsule', 'typedCategory']} />
      </View>

    </View>
    <View style={styles.checkboxControlContainer}>

      <ButtonCheckboxControl 
        onToggleCheckboxes={handleToggleCheckboxes}
        showCheckboxes={showCheckboxes} 
        selectedMoments={selectedMoments}
        isSaving={isMakingCall}
        onSave={handlePreSave}
        buttonColor={themeAheadOfLoading.lightColor}
      
      />
      </View>

      <View style={[styles.categoryButtonsContainer, {backgroundColor: 'rgba(41, 41, 41, 0.2)',borderColor: themeAheadOfLoading.lightColor}]}>

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
      

    <View style={{ height: Dimensions.get("screen").height-100, width: Dimensions.get("screen").width }}>
        <View style={styles.loadingContainer}>
         
        <LoadingPage 
        loading={isMakingCall}  
        color={themeAheadOfLoading.lightColor}
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
            scrollEventThrottle={16} 
          />
        )}
        
      </View>

      {isModalVisible && selectedMoment && (
        <ItemViewMoment 
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
    minWidth: 2,
    flex: 1,
    zIndex: 0,
    paddingHorizontal: 0, 
    justifyContent: 'space-between',
  },
  checkboxControlContainer: {
    width: '100%',  
    minHeight: 30,
    height: '4%',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    alignItems: 'center',
    marginVertical: '1%',
    zIndex: 0,

  },
  searchBarContent: { 
    width: '100%', 
    paddingHorizontal: '1%',
    marginVertical: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center', 
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  categoryButtonsContainer: {
    minHeight: 2,
    paddingHorizontal: 14, 
    borderWidth: 1,
    width: '100%',
    borderRadius: 30,
    paddingVertical: 10, 
    marginBottom: 10,
  },
  contentContainer: { 
    flex: 1, 
    minHeight: 2,
    minWidth: 2,
    width: '100%',
    alignContent: 'right',
    alignItems: 'right',
    justifyContent: 'flex-start',
  },
  tempSelected: {
    borderColor: 'yellow',


  },
  momentContainer: {
    padding: 0,
    width: '100%', 
    //marginBottom: '2%',
    borderRadius: 30, 
  },
  loadingContainer: { 
      position: 'absolute',
      top: 90,
      width: '100%',
  },
  momentContent: {
    width: '100%', 
    //this is the border
    //padding: 2,  
  },
  fadedOut: {
   // opacity: 0.2, // Adjust the faded effect here
  },
  partiallyFadedOut: {
   // opacity: 0.7

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
    padding: 4,     
    width: '100%', 
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    zIndex: 1,
    
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

export default MomentsList;
