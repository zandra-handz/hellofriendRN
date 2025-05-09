import React, { useCallback } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ButtonMomentCategory from '../components/ButtonMomentCategory';
import ButtonMomentChat from '../components/ButtonMomentChat';
import ButtonMoment from '../components/ButtonMoment';
import { CheckBox } from 'react-native-elements';

const SectionMomentsByCategory = ({
  category,
  moments,
  horizontal,
  singleLineScroll,
  effectiveColumns,
  useSvgButton,
  svgColor,
  includeCategoryTitle,
  showCheckboxes,
  toggleSelectMoment,
  selectedMoments,
  openModal,
  expanded,
  handleToggleCategory,
  flashListHeight=300, // New prop to set height of FlashList
}) => {
  const { width: windowWidth } = useWindowDimensions(); // Use useWindowDimensions hook

  const renderMomentItem = useCallback(({ item: moment }) => {
    const isSelected = selectedMoments.includes(moment);

    return (
      <View style={[styles.momentContainer, { width: getButtonWidth(), minHeight: getItemHeight() }]}>
        {showCheckboxes && (
          <CheckBox
            title={moment.name}
            checked={isSelected}
            onPress={() => toggleSelectMoment(moment)}
            containerStyle={[styles.checkboxContainer, { height: getItemHeight(), width: getButtonWidth() - 20 }]}
            textStyle={styles.checkboxText}
          />
        )}
        <View style={styles.momentContent}>
          {useSvgButton ? (
            <ButtonMomentChat onPress={() => openModal(moment)} moment={moment} size={124} color={svgColor} />
          ) : (
            <ButtonMoment onPress={() => openModal(moment)} moment={moment} iconSize={26} size={14} color={svgColor} />
          )}
          {includeCategoryTitle && (
            <View style={styles.categoryCircle}>
              <Text style={styles.categoryText}>{moment.typedCategory}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }, [selectedMoments, showCheckboxes, useSvgButton, svgColor, includeCategoryTitle, openModal, toggleSelectMoment]);

  const getButtonWidth = () => {
    if (!useSvgButton) return windowWidth - 20;
    if (singleLineScroll) return 200;
    return (windowWidth - 20) / effectiveColumns;
  };

  const getItemHeight = () => {
    if (singleLineScroll) return 140;
    return 'auto';
  };

  return (
    <View style={styles.container}>
      <ButtonMomentCategory 
        onPress={() => handleToggleCategory(category)}
        categoryText={category}
        momentCount={moments.length}
      />
      {expanded && (
        <View style={[styles.flashListContainer, { height: flashListHeight }]}>
          <FlashList
            key={`${effectiveColumns}`} // Add a unique key based on effectiveColumns
            data={moments}
            renderItem={renderMomentItem}
            keyExtractor={(moment) => `${moment.id}-${moment.capsule}`}
            horizontal={horizontal && singleLineScroll}
            numColumns={singleLineScroll ? 1 : effectiveColumns}
            columnWrapperStyle={!singleLineScroll && effectiveColumns > 1 ? styles.imageRow : null}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flashListContainer: {
    flex: 1,
    marginTop: 10, // Add marginTop if needed to separate from category button
  },
  momentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  momentContent: {
    flex: 1,
    alignItems: 'center',
  },
  checkboxContainer: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    zIndex: 2,
    bottom: 34, 
  },
  checkboxText: {
    fontSize: 16,
    color: 'black',
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
  imageRow: {
    justifyContent: 'flex-start',
  },
});

export default SectionMomentsByCategory;
