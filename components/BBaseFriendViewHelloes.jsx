import React, { useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import ItemHelloSingle from '../components/ItemHelloSingle';
import { useGlobalStyle } from '../context/GlobalStyleContext';


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
  secondPageBackgroundColor = 'transparent',
  showGradient = false,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },
  satellites = false,  
  onCategoryChange,
  satelliteSectionBackgroundColor = 'transparent', 
  additionalPages = false,
  additionalPagesCategorize = true,
}) => {
  const [category, setCategory] = useState(null);
  const { themeStyles } = useGlobalStyle();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.date);
      if (onCategoryChange) {
        onCategoryChange(topItem.date); // Pass the category to the parent
      }
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
        <View style={{marginBottom: -10, paddingRight: 14}}> 
        <ItemHelloSingle helloObject={item} svgHeight={24} svgWidth={24} />
        </View>
      )}
      estimatedItemSize={29} // Estimate the height/width of each item for optimization
      
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }} 
      showsHorizontalScrollIndicator={false} 
      ListFooterComponent={<View style={{ width: 283 }} />}
    /> 

    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={[themeStyles.genericBackground, {borderRadius: buttonRadius}]}>
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
                  paddingHorizontal: 10,
                  alignContent: 'center',
                  alignItems: 'center', 
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
                    flex: 1,
                  }}
                >
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left' },
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
                    width: 50,
                    borderRadius: buttonRadius, 
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
        <View style={[styles.additionalSatelliteSection, { height: buttonHeight, borderRadius: buttonRadius, backgroundColor: secondPageBackgroundColor}]}>
          {additionalPagesCategorize && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}> </Text>
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
    marginLeft: -50,
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent', 
  },
  additionalSatelliteSection: {
    paddingHorizontal: 6,
    flexDirection: 'column', 
    justifyContent: 'center',
    width: '100%',
  },
  categoryText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 18,
    textOverflow: 'ellipsis',
  },
  categoryTextContainer: {
    width: 300,
    top: -8,
    position: 'absolute',
    marginLeft: 10,
    height: 30,
    marginBottom: 0,
    justifyContent: 'center',
  },
});

export default BaseFriendViewHelloes;
