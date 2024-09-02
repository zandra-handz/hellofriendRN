import React, { useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import ItemHelloSingle from '../components/ItemHelloSingle';



const BaseFriendViewHelloes = ({

  buttonHeight,
  buttonRadius = 10,
  isFetching,
  allItems,
  additionalText = '',
  additionalTextFontSize = 16,
  additionalTextColor = 'white',
  typeIcon = null,
  backgroundColor = 'transparent',
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },
  satellites = false, 
  satelliteSectionBackgroundColor = 'black', 
  additionalPages = false,
  additionalPagesCategorize = true,
}) => {
  const [category, setCategory] = useState(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.date);
    }
  }).current;

  const adjustFontSize = (fontSize) => {
    return fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
  });

  const renderAdditionalSatellites = useCallback(() => {
    return ( 
    <FlashList
      data={allItems}
      horizontal
      keyExtractor={(item, index) => `additional-satellite-${index}`}
      renderItem={({ item }) => (
        <ItemHelloSingle helloObject={item} helloHeight={20} helloWidth={20} />
      )}
      estimatedItemSize={20} // Estimate the height/width of each item for optimization
      
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }} 
      ListFooterComponent={<View style={{ width: 283 }} />}
    /> 

    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
      {!additionalPages && (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={[
                styles.mainButtonContainer,
                { height: buttonHeight, width: '100%'},
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: buttonHeight,
                  padding: 10,
                  paddingBottom: 2,
                  borderRadius: buttonRadius,
                  overflow: 'hidden',
                  backgroundColor: showGradient ? 'transparent' : backgroundColor,
                }}
              >
                {showGradient && (
                  <LinearGradient
                    colors={[darkColor, lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={direction}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'column',
                    paddingHorizontal: 5,
                    paddingBottom: 8,
                    paddingTop: 8,
                    flex: 1,
                  }}
                >
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginVertical: 4, marginBottom: 2 },
                    ]}
                  >
                    {additionalText}
                  </Text>
                </View>
              </View>
            </View>
            {satellites && (
              <View
                style={[
                  styles.satelliteSection,
                  {
                    height: buttonHeight,
                    borderRadius: buttonRadius,
                    backgroundColor: satelliteSectionBackgroundColor,
                    flexDirection: 'row',
                  },
                ]}
              >
                {typeIcon}
              </View>
            )}
          </View>
        </View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, { height: buttonHeight, borderRadius: buttonRadius }]}>
          {additionalPagesCategorize && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )} 
          {allItems && !isFetching && (
          <>
            {renderAdditionalSatellites()} 
          </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  satelliteSection: {
    width: '24%',
    marginLeft: -70,
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 0,
  },
  additionalSatelliteSection: {
    flexDirection: 'column',
    marginVertical: 0,
    backgroundColor: 'black',
    width: '100%',
  },
  categoryText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 18,
    textOverflow: 'ellipsis',
  },
  categoryTextContainer: {
    width: 300,
    marginLeft: 10,
    height: 42,
    marginBottom: 0,
    justifyContent: 'center',
  },
});

export default BaseFriendViewHelloes;
