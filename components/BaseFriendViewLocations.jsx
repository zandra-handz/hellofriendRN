import React, { useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';  
import { LinearGradient } from 'expo-linear-gradient';
import ItemLocationSingle from '../components/ItemLocationSingle';
import ItemLocationFavesHorizontal from '../components/ItemLocationFavesHorizontal'; 

import { FlashList } from '@shopify/flash-list';

const BaseFriendViewLocations = ({ 
  buttonHeight = 90,
  buttonRadius = 10, 
  allItems,     
  backgroundColor = 'transparent', 
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },   
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteCount = 3, 
  satelliteLocations = [],  
  additionalPages = false,
  additionalPagesCategorize = true, 
}) => {
  const [category, setCategory] = useState(null);


  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.title);   
    }
  }).current; 
 
  const adjustFontSize = (fontSize) => {
    return fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
  });
 
  const renderSatellites = () => {
    if (!satellites || satelliteLocations.length === 0) {
      return null;
    }

    const numSatellites = Math.min(satelliteCount, satelliteLocations.length);
    const satellitesArray = [];

    for (let i = 0; i < numSatellites; i++) {
      satellitesArray.push(
        <ItemLocationSingle key={`satellite-${i}`} locationObject={null}  />
      );
    }
    return satellitesArray;
  };

  const renderAdditionalSatellites = useCallback(() => {
    return (
      <FlashList
        data={allItems}
        horizontal
        keyExtractor={(item, index) => `additional-satellite-${index}`}
        renderItem={({ item }) => (
          <ItemLocationSingle locationObject={item} locationWidth={20} locationHeight={20} spacer={30} />
        )}
        estimatedItemSize={50}  
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        ListFooterComponent={<View style={{ width: 283 }} />} // Add blank space at the end of the list
      />

    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
      {!additionalPages && (
        <View style={{ }}>
          <View style={{ flexDirection: 'row' }}>
          <View style={[styles.mainButtonContainer, { height: buttonHeight, width: satellites ? '100%' : '100%' }]}>
            <View
              style={{
                flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                width: '100%',
                height: buttonHeight,
                padding: 10,
                borderRadius: buttonRadius,
                alignItems: 'center',
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
                <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingBottom: 0, paddingTop: 6, flex: 1, width: '100%' }}>
                
                <View style={styles.svgContainer}>
                <PushPinSolidSvg width={20} height={20} color="white" />
                </View>
                  <View style={{ width: '100%', flexDirection: 'row' }}>
                  
                        <View> 
                          <ItemLocationFavesHorizontal containerWidth={254} width={31} height={31}/> 
                        </View>
                  </View> 
                </View>
              </View>
            </View> 
          </View>
        </View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {borderRadius: buttonRadius, height: buttonHeight}]}>
          {additionalPagesCategorize && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};
  
const styles = StyleSheet.create({ 
  container: {
    flex: 1,
  },
svgContainer: {
    marginRight: 40,
},
  satelliteSection: {
    width: '0%',
    height: 0,
    paddingLeft: 8, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  additionalSatelliteSection: {
    flexDirection: 'column',
    marginVertical: 0,  
    backgroundColor: 'black',
  
  },
  categoryTextContainer: { 
    width: 300,  
    marginLeft: 10, 
    height: 42,
    marginBottom: 0,
    justifyContent: 'center',
    whiteSpace: 'nowrap', 
  },

  categoryText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular', 
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 18,
    whiteSpace: 'nowrap', // This property may not be supported in React Native, so adjust using maxWidth or width
    textOverflow: 'ellipsis', // This property may not be supported in React Native, so adjust using maxWidth or width
  
  },
});

export default BaseFriendViewLocations;
