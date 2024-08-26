import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using this for icons
import ItemViewMoment from '../components/ItemViewMoment';


const windowWidth = Dimensions.get('window').width;

const ItemMomentMulti = ({ 
  horizontal = true,
  singleLineScroll = true,
  columns = 3, 
  width = 100,
  height = 100,
  limit,
  newestFirst = true,
  svgColor = 'white',
  containerWidth = 320, // Width for friend focus page button
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

  const calculateFontSize = (width) => width * 0.06;

  const calculateBubbleContainerDimensions = (width, height) => ({
    width: width * .96,
    height: height * 0.58,
  });

  const calculateLeftPadding = (bubbleWidth) => bubbleWidth * 0.06;

  const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);

  // Unique key generator function
  const generateUniqueKey = (item) => `${item.id}-${item.capsule}`;

  return (
    <View style={[styles.container, { width: containerWidth, minHeight: 2 }]}>
      {viewSortedList && (
        <View style={styles.controlPanel}>
          <TouchableOpacity onPress={handleExpandAll} style={styles.controlButton}>
            <Icon name="expand-all" size={24} color="black" />
            <Text style={styles.controlButtonText}>Expand All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCollapseAll} style={styles.controlButton}>
            <Icon name="collapse-all" size={24} color="black" />
            <Text style={styles.controlButtonText}>Collapse All</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewSortedList && Object.keys(groupedMoments).map(category => (
        <View key={category}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => handleToggleCategory(category)}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
          {expandedCategories[category] && (
            <FlatList
              data={groupedMoments[category]}
              keyExtractor={(moment) => generateUniqueKey(moment)}
              renderItem={({ item: moment }) => (
                <TouchableOpacity onPress={() => openModal(moment)}>
                  <View style={[styles.relativeContainer, { width, height, marginRight: 10 }]}>
                    <BubbleChatSquareSolidSvg width={width} height={height} color={svgColor} style={styles.svgImage} />
                    <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                      <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.2 }]}>{moment.capsule}</Text>
                      {includeCategoryTitle && (
                        <View style={[styles.categoryCircle, { backgroundColor: 'green' }]}>
                          <Text style={styles.categoryText}>{moment.typedCategory}</Text>
                        </View>
                      )}
                    </View>
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
              <View style={[styles.relativeContainer, { width, height, marginRight: 10 }]}>
                <BubbleChatSquareSolidSvg width={width} height={height} color={svgColor} style={styles.svgImage} />
                <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                  <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.2 }]}>{moment.capsule}</Text>
                  {includeCategoryTitle && (
                    <View style={[styles.categoryCircle, { backgroundColor: 'green' }]}>
                      <Text style={styles.categoryText}>{moment.typedCategory}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )} 
          numColumns={horizontal && !singleLineScroll ? 3 : 1}
          horizontal={horizontal && singleLineScroll}
          columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
          contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
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
  container: {
     
    width: 320,
},
  relativeContainer: {
    position: 'relative',
  },
  bubbleContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  bubbleText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
  imageContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  imageRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    margin: 5,
    borderRadius: 10,
    color: 'white',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryCircle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'left',
  },
  categoryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default ItemMomentMulti;
