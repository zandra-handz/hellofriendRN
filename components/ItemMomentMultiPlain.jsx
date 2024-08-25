import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'; // Import CheckBox
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCapsuleList } from '../context/CapsuleListContext';
import ButtonMoment from '../components/ButtonMoment';
import ButtonMomentChat from '../components/ButtonMomentChat';
import ItemViewMoment from '../components/ItemViewMoment';
import ButtonMomentCategory from '../components/ButtonMomentCategory';

const windowWidth = Dimensions.get('window').width;

const ItemMomentMultiPlain = ({ 
  passInData = false,
  data = [],
  horizontal = true,
  singleLineScroll = true,
  columns = 3, 
  limit,
  newestFirst = true,
  svgColor = 'white',
  includeCategoryTitle = false,
  viewSortedList = true,
}) => {
  const { sortedByCategory, newestFirst: newestFirstList } = useCapsuleList();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [useSvgButton, setUseSvgButton] = useState(true); // State for button type
  const [selectedMoments, setSelectedMoments] = useState([]); // State for selected moments
  const [showCheckboxes, setShowCheckboxes] = useState(passInData); // State for showing checkboxes

  const listToDisplay = passInData ? data : (viewSortedList ? sortedByCategory : (newestFirst ? newestFirstList : []));
  const moments = useMemo(() => listToDisplay.slice(0, limit), [listToDisplay, limit]);

  useEffect(() => {
    console.log(sortedByCategory);
  }, [sortedByCategory]);

  const groupedMoments = useMemo(() => {
    return moments.reduce((acc, moment) => {
      const category = passInData ? (moment.typed_category || 'No category') : (moment.typedCategory || 'Uncategorized');
      (acc[category] = acc[category] || []).push(moment);
      return acc;
    }, {});
  }, [moments]);

  useEffect(() => {
    if (viewSortedList) {
      const initialExpandedCategories = Object.keys(groupedMoments).reduce((acc, category) => {
        acc[category] = expandAll;
        return acc;
      }, {});
      setExpandedCategories(initialExpandedCategories);
    }
  }, [groupedMoments, viewSortedList, expandAll]);

  const handleToggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setExpandedCategories(Object.keys(groupedMoments).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {}));
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setExpandedCategories(Object.keys(groupedMoments).reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {}));
  };

  const openModal = (moment) => {
    setSelectedMoment(moment);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMoment(null);
    setIsModalVisible(false);
  };

  const generateUniqueKey = (item) => `${item.id}-${item.capsule}`;

  // Calculate button width dynamically based on useSvgButton state
  const getButtonWidth = () => {
    if (!useSvgButton) return windowWidth - 20; // Full width when not using svg button
    if (singleLineScroll) return 200; // Width for horizontal scroll
    return (windowWidth - 20) / columns; // Calculate width based on columns
  };

  // Dynamically adjust height based on singleLineScroll
  const getItemHeight = () => {
    if (singleLineScroll) return 140; // Fixed height for horizontal scroll
    return 'auto'; // Auto height for vertical scroll
  };

  // Determine columns based on useSvgButton state
  const effectiveColumns = useSvgButton ? columns : 1; // Override columns when not using svg button

  const toggleSelectMoment = (moment) => {
    let updatedSelectedMoments;
  
    if (selectedMoments.includes(moment)) {
      updatedSelectedMoments = selectedMoments.filter((m) => m !== moment);
    } else {
      updatedSelectedMoments = [...selectedMoments, moment];
    }
  
    setSelectedMoments(updatedSelectedMoments);
    
    // Log the currently selected moments
    console.log('Selected Moments:', updatedSelectedMoments);
  };

  const renderMomentItem = ({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);
  
    return ( 

      <View style={[styles.momentContainer, {minHeight: getItemHeight(), width: getButtonWidth()} ]}>
        {showCheckboxes && (
          <>
          <CheckBox
            key={moment.id} // Added key here
            title={moment.name} // Assuming `moment` has a `name` property
            checked={isSelected}
            onPress={() => toggleSelectMoment(moment)} // Updated to toggle selection
            containerStyle={[styles.checkboxContainer, {paddingTop: 0, height: getItemHeight(), width: getButtonWidth() - 20}]}
            textStyle={styles.checkboxText}
          />

          </>
        )}
        <View style={styles.momentContent}>
          {useSvgButton ? (
            <View style={{ width: '100%', height: 110, marginBottom: 10 }}>
              <ButtonMomentChat onPress={() => openModal(moment)} moment={moment} size={124} color={svgColor} />
            </View>
          ) : (
            <View style={{ width: '100%', height: 140, marginBottom: 10 }}>
              <ButtonMoment onPress={() => openModal(moment)} moment={moment} iconSize={26} size={12} color={svgColor} />
            </View>
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
  
  return (
    <View>
      <View style={styles.controlPanel}>
        <TouchableOpacity onPress={handleExpandAll} style={styles.controlButton}>
          <Icon name="expand" size={24} color="black" />
          <Text style={styles.controlButtonText}>Expand</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCollapseAll} style={styles.controlButton}>
          <Icon name="compress" size={24} color="black" />
          <Text style={styles.controlButtonText}>Collapse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUseSvgButton(prev => !prev)} style={styles.controlButton}>
          <Icon name="exchange" size={24} color="black" />
          <Text style={styles.controlButtonText}>{useSvgButton ? "Switch" : "Switch"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCheckboxes(prev => !prev)} style={styles.controlButton}>
          <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={24} color="black" />
          <Text style={styles.controlButtonText}>{showCheckboxes ? "Reuse" : "Reuse"}</Text>
        </TouchableOpacity>
      </View>

      {viewSortedList && Object.keys(groupedMoments).map(category => (
        <View key={category}>  
          <ButtonMomentCategory 
            onPress={() => handleToggleCategory(category)}
            categoryText={category}
            momentCount={groupedMoments[category].length}
          />  
          {expandedCategories[category] && (
            <View> 
              <FlatList
                data={groupedMoments[category]}  // Correctly pass data for each category
                keyExtractor={(moment) => generateUniqueKey(moment)}
                renderItem={renderMomentItem}
                horizontal={horizontal && singleLineScroll}
                numColumns={singleLineScroll ? 1 : effectiveColumns}  // Adjust based on singleLineScroll and useSvgButton
                columnWrapperStyle={!singleLineScroll && effectiveColumns > 1 ? styles.imageRow : null}
                estimatedItemSize={100}
                showsHorizontalScrollIndicator={false}
                key={`${effectiveColumns}-${useSvgButton}-${showCheckboxes}`} // Add showCheckboxes to key to force re-render
                ListFooterComponent={<View style={{ height: 60 }} />} 
              />
            </View>
          )}
        </View>
      ))}

      {!viewSortedList && (
        <FlatList
          data={moments}
          keyExtractor={(moment) => generateUniqueKey(moment)}
          renderItem={renderMomentItem}
          horizontal={horizontal && singleLineScroll}
          numColumns={singleLineScroll ? 1 : effectiveColumns}
          columnWrapperStyle={!singleLineScroll && effectiveColumns > 1 ? styles.imageRow : null}
          estimatedItemSize={100}
          showsHorizontalScrollIndicator={false}
          key={`${effectiveColumns}-${useSvgButton}-${showCheckboxes}`} // Add showCheckboxes to key to force re-render
        />
      )}

      {selectedMoment && (
        <ItemViewMoment 
          archived={passInData}
          isModalVisible={isModalVisible}
          moment={selectedMoment}
          onClose={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    
    backgroundColor: '#f0f0f0',
  },
  controlButton: {
    flexDirection: 'row',
    flex: 1,
    height: 70,
    alignItems: 'center',
  },
  controlButtonText: {
    
  
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
  momentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  momentContent: {
    flex: 1,
    alignItems: 'center',
  },
  categoryCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  categoryText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    
  },
  checkboxContainer: {
    margin: 0,
    padding: 0,
    position: 'absolute', 
    zIndex: 2,
    bottom: 34,
    backgroundColor: 'transparent',
  },
  checkboxText: {
    fontSize: 16,
    color: 'black',
  },
  imageRow: {
    justifyContent: 'flex-start',
  },
});

export default ItemMomentMultiPlain;
