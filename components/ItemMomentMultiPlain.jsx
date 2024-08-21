import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons
import { useCapsuleList } from '../context/CapsuleListContext';
import ButtonMoment from '../components/ButtonMoment'; // Importing ButtonMoment
import ItemViewMoment from '../components/ItemViewMoment'; // Importing ItemViewMoment
import ButtonMomentCategory from '../components/ButtonMomentCategory';


const windowWidth = Dimensions.get('window').width;

const ItemMomentMultiPlain = ({ 
  horizontal = true,
  singleLineScroll = true,
  columns = 3, 
  limit,
  newestFirst = true,
  svgColor = 'white',
  includeCategoryTitle = false,
  viewSortedList = true // Boolean prop to determine view mode
}) => {
  const { sortedByCategory, newestFirst: newestFirstList } = useCapsuleList();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({}); // Track expanded categories
  const [expandAll, setExpandAll] = useState(true); // State for control panel

  // Determine the list to display based on viewSortedList prop
  const listToDisplay = viewSortedList ? sortedByCategory : (newestFirst ? newestFirstList : []);

  // Set moments state based on the listToDisplay and limit
  const moments = useMemo(() => listToDisplay.slice(0, limit), [listToDisplay, limit]);

  // Group moments by category
  const groupedMoments = useMemo(() => {
    return moments.reduce((acc, moment) => {
      const category = moment.typedCategory || 'Uncategorized';
      (acc[category] = acc[category] || []).push(moment);
      return acc;
    }, {});
  }, [moments]);

  // Initialize expandedCategories only when using sorted list
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

  // Unique key generator function
  const generateUniqueKey = (item) => `${item.id}-${item.capsule}`;

  return (
    <View style={{ minHeight: 2 }}>
      <View style={styles.controlPanel}>
        <TouchableOpacity onPress={handleExpandAll} style={styles.controlButton}>
          <Icon name="expand" size={24} color="black" />
          <Text style={styles.controlButtonText}>Expand All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCollapseAll} style={styles.controlButton}>
          <Icon name="compress" size={24} color="black" />
          <Text style={styles.controlButtonText}>Collapse All</Text>
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
            <FlatList
              data={groupedMoments[category]}
              keyExtractor={(moment) => generateUniqueKey(moment)}
              renderItem={({ item: moment }) => (
                <TouchableOpacity onPress={() => openModal(moment)}>
                  <View style={styles.momentContainer}>
                    <ButtonMoment onPress={() => openModal(moment)} moment={moment} iconSize={26} size={14} color={svgColor} />
                    {includeCategoryTitle && (
                      <View style={styles.categoryCircle}>
                        <Text style={styles.categoryText}>{moment.typedCategory}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              numColumns={columns}
              columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
              estimatedItemSize={100}
            />
          )}
        </View>
      ))}

      {!viewSortedList && (
        <FlatList
          data={moments}
          keyExtractor={(moment) => generateUniqueKey(moment)}
          renderItem={({ item: moment }) => (
            <TouchableOpacity onPress={() => openModal(moment)}>
              <View style={styles.momentContainer}>
                <ButtonMoment moment={moment} size={24} color={svgColor} />
                {includeCategoryTitle && (
                  <View style={styles.categoryCircle}>
                    <Text style={styles.categoryText}>{moment.typedCategory}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          numColumns={columns}
          columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
          estimatedItemSize={100}
        />
      )}

      {isModalVisible && (
          <ItemViewMoment moment={selectedMoment} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: {
    flexDirection: 'row',
    alignItems: 'left',
    padding: 10,
    backgroundColor: 'transparent',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  controlButtonText: {
    marginLeft: 5,
    fontFamily: 'Poppins-Bold',
  },
  momentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: .8,
    borderColor: 'black',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 11, // doing too much spacing for ButtonMomentCategory
    marginTop: 5,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: 'lightgray',
    marginVertical: 2,
    borderRadius: 10,
  },
  categoryButtonText: { 
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  categoryCircle: {
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'green',
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemMomentMultiPlain;
