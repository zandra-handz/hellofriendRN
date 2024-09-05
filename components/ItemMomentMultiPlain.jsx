import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList } from 'react-native';
import ButtonMomentCategorySmall from '../components/ButtonMomentCategorySmall';
import ButtonMoment from '../components/ButtonMoment';
import ButtonMomentChat from '../components/ButtonMomentChat';
import ButtonControlPanel from '../components/ButtonControlPanel';
import ItemViewMoment from '../components/ItemViewMoment';
import { CheckBox } from 'react-native-elements';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const windowWidth = Dimensions.get('window').width;
const footerHeight = 100; // Set to a fixed height for footer

const ItemMomentMultiPlain = ({
  passInData = false,
  svgColor = 'gray',
  includeCategoryTitle = false,
  viewSortedList = true,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // New state for selected category
  const [showCheckboxes, setShowCheckboxes] = useState(passInData);
  const [showSVG, setShowSVG] = useState(false);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const flatListRef = useRef(null); // Ref for FlatList of moments
  const categoryFlatListRef = useRef(null); // Ref for FlatList of categories

  // Use capsuleList as moments
  const moments = capsuleList;

  // Create categoryStartIndices based on moments
  const categoryStartIndices = useMemo(() => {
    let index = 0;
    return moments.reduce((acc, moment) => {
      const category = moment.typedCategory || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = index;
      }
      index += 1;
      return acc;
    }, {});
  }, [moments]);

  const handleToggleCategory = (category) => {
    setExpandedCategory(prev => (prev === category ? null : category));
    setSelectedCategory(prev => (prev === category ? null : category)); // Update selected category
    const startIndex = categoryStartIndices[category];
    if (startIndex !== undefined) {
      flatListRef.current?.scrollToIndex({ index: startIndex, animated: true });
      // Scroll category buttons to selected category
      const categoryIndex = Object.keys(categoryStartIndices).indexOf(category);
      categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
    }
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setExpandedCategory(null);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setExpandedCategory(null);
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

  const handleSwitchView = () => {
    setShowSVG(prev => !prev);
  };

  const toggleSelectMoment = (moment) => {
    const updatedSelectedMoments = selectedMoments.includes(moment)
      ? selectedMoments.filter((m) => m !== moment)
      : [...selectedMoments, moment];
    setSelectedMoments(updatedSelectedMoments);
  };

  // Determine visible items and update the selected category
  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleCategory = moments.find(moment => viewableItems.some(viewable => viewable.item.id === moment.id))?.typedCategory;
      if (visibleCategory) {
        setSelectedCategory(visibleCategory);
        // Scroll category buttons to visible category
        const categoryIndex = Object.keys(categoryStartIndices).indexOf(visibleCategory);
        if (categoryIndex !== -1) {
          categoryFlatListRef.current?.scrollToIndex({ index: categoryIndex, animated: true });
        }
      }
    }
  }, [moments, categoryStartIndices]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Adjust as needed
  };

  const renderMomentItem = ({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);
    const isHighlighted = moment.typedCategory === selectedCategory;

    return (
      <View style={[styles.momentContainer, isHighlighted && styles.highlightedMoment]}>
        {showCheckboxes && (
          <CheckBox
            key={moment.id}
            checked={isSelected}
            onPress={() => toggleSelectMoment(moment)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        )}
        <View style={styles.momentContent}>
          {showSVG ? (
            <ButtonMomentChat
              moment={moment}
              onPress={() => openModal(moment)}
              disabled={false}
              sameStyleForDisabled={true}
              svgColor={svgColor}
            />
          ) : (
            <ButtonMoment
              moment={moment}
              onPress={() => openModal(moment)}
              disabled={false}
              sameStyleForDisabled={true}
            />
          )}
          {includeCategoryTitle && (
            <View style={styles.categoryCircle}>
              <Text style={styles.categoryText}>{moment.typedCategory}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMomentChatItem = ({ item: moment }) => {
    return (
      <View style={[styles.momentContainer, { width: windowWidth / 3 }]}>
        <ButtonMomentChat
          moment={moment}
          onPress={() => openModal(moment)}
          disabled={false}
          sameStyleForDisabled={true}
          svgColor={svgColor}
        />
      </View>
    );
  };
 

  return (
    <View style={styles.container}>
      <ButtonControlPanel
        onCollapseAll={() => {}}
        onSwitchView={() => {}}
        onToggleCheckboxes={handleToggleCheckboxes}
        showCheckboxes={showCheckboxes}
        showSVG={showSVG}
      />

      <View style={{ width: '100%', marginVertical: 10 }}>
        <FlatList
          ref={categoryFlatListRef} // Attach the ref here
          data={Object.keys(categoryStartIndices)}
          renderItem={({ item: category }) => ( 
            <ButtonMomentCategorySmall
              key={category}
              onPress={() => handleToggleCategory(category)}
              categoryText={category}
              momentCount={moments.filter(moment => moment.typedCategory === category).length}
              highlighted={category === selectedCategory} // Pass highlighted prop
            /> 
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={100} // Adjust based on your ButtonMomentCategory size
          style={styles.categoryButtonsContainer}
          contentContainerStyle={{ paddingRight: 300 }} // Add extra space to the right
        />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef} // Attach the ref here
          data={moments}
          renderItem={showSVG ? renderMomentChatItem : renderMomentItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={showSVG ? 3 : 1}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={showSVG ? styles.imageRow : undefined}
          ListFooterComponent={() => <View style={{ height: 840 }} />}  // Add the footer component here
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: 100, // Adjust based on your item size
            offset: 100 * index, // Adjust based on your item size
            index,
          })}
          
          scrollEventThrottle={16} // Adjust for performance
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
    justifyContent: 'space-between', // Adjust paddingTop based on header height
  },
  categoryButtonsContainer: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
  },
  contentContainer: {
    backgroundColor: 'black',
  },
  momentContainer: {
    padding: 0, // Reduced padding to remove extra white space
    margin: 0,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  momentContent: {
    padding: 10,
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
    backgroundColor: 'lightblue', // Customize the highlight color as needed
  },
  imageRow: {
    justifyContent: 'space-between',
  },
});

export default ItemMomentMultiPlain;
