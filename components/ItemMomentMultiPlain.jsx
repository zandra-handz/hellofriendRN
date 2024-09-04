import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import ButtonMomentCategory from '../components/ButtonMomentCategory';
import ButtonMoment from '../components/ButtonMoment';
import ButtonMomentChat from '../components/ButtonMomentChat';
import ButtonControlPanel from '../components/ButtonControlPanel';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemViewMoment from '../components/ItemViewMoment';
import { CheckBox } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;

const ItemMomentMultiPlain = ({
  passInData = false,
  data = [],
  limit,
  svgColor = 'gray',
  includeCategoryTitle = false,
  viewSortedList = true,
}) => {
  const { sortedByCategory, newestFirst: newestFirstList } = useCapsuleList();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(passInData);
  const [showSVG, setShowSVG] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [selectedMoments, setSelectedMoments] = useState([]);

  const listToDisplay = passInData ? data : (viewSortedList ? sortedByCategory : newestFirstList);
  const moments = useMemo(() => listToDisplay.slice(0, limit), [listToDisplay, limit]);

  const groupedMoments = useMemo(() => {
    return moments.reduce((acc, moment) => {
      const category = passInData ? (moment.typed_category || 'No category') : (moment.typedCategory || 'Uncategorized');
      (acc[category] = acc[category] || []).push(moment);
      return acc;
    }, {});
  }, [moments, passInData]);

  const handleToggleCategory = (category) => {
    setExpandedCategory(prev => (prev === category ? null : category));
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
    let updatedSelectedMoments;
    if (selectedMoments.includes(moment)) {
      updatedSelectedMoments = selectedMoments.filter((m) => m !== moment);
    } else {
      updatedSelectedMoments = [...selectedMoments, moment];
    }
    setSelectedMoments(updatedSelectedMoments);
  };

  const renderMomentItem = ({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);

    return (
      <View style={styles.momentContainer}>
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
        onCollapseAll={handleCollapseAll}
        onSwitchView={handleSwitchView}
        onToggleCheckboxes={handleToggleCheckboxes}
        showCheckboxes={showCheckboxes}
        showSVG={showSVG}
      />

      <View style={styles.categoryButtonsContainer}>
        {Object.keys(groupedMoments).map((category) => (
          <ButtonMomentCategory
            key={category}
            onPress={() => handleToggleCategory(category)}
            categoryText={category}
            momentCount={groupedMoments[category].length}
          />
        ))}
      </View>

      <ScrollView style={styles.contentContainer}>
        {Object.keys(groupedMoments).map((category) => (
          <View key={category} style={styles.categoryWrapper}>
            {(expandAll || expandedCategory === category) && (
              <View style={styles.flatListContainer}>
                <FlatList
                  key={showSVG ? 'chat' : 'moment'}
                  data={groupedMoments[category]}
                  renderItem={showSVG ? renderMomentChatItem : renderMomentItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={showSVG ? 3 : 1}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={showSVG ? styles.imageRow : undefined}
                />
              </View>
            )}
          </View>
        ))}

        {!Object.keys(groupedMoments).length && (
          <View style={styles.flatListContainer}>
            <FlatList
              key={showSVG ? 'chat-empty' : 'moment-empty'}
              data={moments}
              renderItem={showSVG ? renderMomentChatItem : renderMomentItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={showSVG ? 3 : 1}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={showSVG ? styles.imageRow : undefined}
            />
          </View>
        )}
      </ScrollView>

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
    flex: 1, 
    width: '100%',
    justifyContent: 'space-between',// Adjust paddingTop based on header height
  },
  categoryButtonsContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    borderWidth:1,
    borderRadius: 20,
    borderColor: 'black',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'black',
    height: 460,
  },
  categoryWrapper: {
    marginBottom: 4,
  },
  flatListContainer: {
    height: 450,
  },
  momentContainer: {
    width: '100%',
    borderWidth: 1,
    backgroundColor: 'gray',
    borderRadius: 30,
    padding: 0,
  },
  momentContent: {
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
  checkboxContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    right: 10,
  },
  checkboxText: {
    color: 'black',
  },
  imageRow: {
    justifyContent: 'space-around',
  },
});

export default ItemMomentMultiPlain;
