import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList, Animated } from 'react-native';
import ButtonMomentCategorySmall from '../components/ButtonMomentCategorySmall';
import ButtonMoment from '../components/ButtonMoment'; 
import ButtonCheckboxControl from '../components/ButtonCheckboxControl';
import ItemViewMoment from '../components/ItemViewMoment';
import { CheckBox } from 'react-native-elements';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const windowWidth = Dimensions.get('window').width;
const footerHeight = 800; // Set to a fixed height for footer

const ItemMomentMultiPlain = ({
  passInData = false,
  svgColor = 'gray',
  includeCategoryTitle = false,
  viewSortedList = true,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();
  const { calculatedThemeColors } = useSelectedFriend();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(passInData);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const flatListRef = useRef(null);
  const categoryFlatListRef = useRef(null);
  const [categoryButtonPressed, setCategoryButtonPressed] = useState(false);
  const timerRef = useRef(null);

  // Use capsuleList as moments
  const moments = capsuleList;

  const categoryStartIndices = useMemo(() => {
    let index = 0;
    return moments.reduce((acc, moment) => {
      const category = moment.typedCategory || 'Uncategorized';
      if (acc[category] === undefined) {
        acc[category] = index;
      }
      index += 1;
      console.log(index);
      return acc;
    }, {});
  }, [moments]);

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

  const DELAY = 64;

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (viewableItems.length > 0 && !categoryButtonPressed) {
      const visibleCategory = moments.find(moment => viewableItems.some(viewable => viewable.item.id === moment.id))?.typedCategory;

      if (visibleCategory) {
        timerRef.current = setTimeout(() => {
          setSelectedCategory(visibleCategory);
          console.log('set selected category');

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
    setShowCheckboxes(prev => !prev);
  };

  const toggleSelectMoment = (moment) => {
    const updatedSelectedMoments = selectedMoments.includes(moment)
      ? selectedMoments.filter((m) => m !== moment)
      : [...selectedMoments, moment];
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
      />

      <View style={{ width: '100%', marginBottom: 20 }}>
        <FlatList
          ref={categoryFlatListRef}
          data={Object.keys(categoryStartIndices)}
          renderItem={({ item: category }) => (
            <ButtonMomentCategorySmall
              key={category}
              onPress={() => handleToggleCategory(category)}
              categoryText={category}
              momentCount={moments.filter(moment => moment.typedCategory === category).length}
              highlighted={category === selectedCategory}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={100}
          style={styles.categoryButtonsContainer}
          contentContainerStyle={{ paddingRight: 300 }}
        />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={moments}
          renderItem={renderMomentItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={undefined}
          ListFooterComponent={() => <View style={{ height: footerHeight }} />}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
        />
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
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  categoryButtonsContainer: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    borderColor: 'black',
    backgroundColor: 'black',
  },
  contentContainer: {},
  momentContainer: {
    padding: 0,
    marginBottom: 8,
    borderRadius: 40,
    backgroundColor: 'transparent',
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
