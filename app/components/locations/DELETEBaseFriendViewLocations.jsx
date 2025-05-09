import React, { useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list'; 
import ItemLocationSingle from '../ItemLocationSingle';
import ItemLocationFavesHorizontal from '../ItemLocationFavesHorizontal'; 
import PushPinSolidSvg from '@/app/assets/svgs/push-pin-solid.svg';  
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const BaseFriendViewLocations = ({ 
  buttonHeight = 90,
  buttonRadius = 10, 
  allItems,          
  additionalPages = false,
  additionalPagesCategorize = true, 
}) => {

  const [category, setCategory] = useState(null);
  const { themeStyles } = useGlobalStyle();
  
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.title);   
    }
  }).current;  

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
        ListFooterComponent={<View style={{ width: 283 }} />}
      
      />
    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
    {additionalPages ? (
      <View style={[styles.additionalSatelliteSection, { borderRadius: buttonRadius, height: buttonHeight }]}>
        {additionalPagesCategorize && (
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {renderAdditionalSatellites()}
      </View>
    ) : (
      <View style={[styles.mainButtonContainer, { height: buttonHeight }]}>
        <View style={[styles.mainButtonContent, { borderRadius: buttonRadius }]}>
 
          <View style={styles.iconAndLocationContainer}>
            <View style={styles.svgContainer}>
              <PushPinSolidSvg width={20} height={20} style={themeStyles.friendFocusSectionIcon} />
            </View>
            <ItemLocationFavesHorizontal containerWidth={296} width={31} height={31} />
          </View>
        </View>
      </View>
    )}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
},
mainButtonContainer: {
  width: '100%',
},
mainButtonContent: {
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  padding: 10,
  alignItems: 'center',
  overflow: 'hidden',
},
iconAndLocationContainer: {
  flexDirection: 'row',
  paddingHorizontal: 5,
  paddingTop: 6,
  flex: 1,
  width: '100%',
},
svgContainer: {
  marginRight: 20,
},
additionalSatelliteSection: {
  flexDirection: 'column',
  backgroundColor: 'black',
},
categoryTextContainer: {
  width: 300,
  marginLeft: 10,
  height: 42,
  justifyContent: 'center',
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
});

export default BaseFriendViewLocations;