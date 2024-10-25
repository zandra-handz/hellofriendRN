import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list'; 
import ItemMomentSingle from '../components/ItemMomentSingle';
import ItemMomentMulti from '../components/ItemMomentMulti'; 
import { useCapsuleList } from '../context/CapsuleListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonLottieAnimationSatellitesMoments = ({
  buttonHeight = 270,
  buttonRadius = 10, 
  headerText = 'LAST ADDED', 
  allItems,      
  additionalPages = false,
  additionalPagesCategorize = true, 
  pauseAnimation=false, 
}) => { 

  const { themeStyles } = useGlobalStyle();
  const [category, setCategory] = useState(null);
  const { capsuleList } = useCapsuleList();
  const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setCategory(topItem.typedCategory);
    }
  }, []);

  useEffect(() => {
    if (capsuleList.length > 0) {
      setIsCapsuleListReady(true);
    }
  }, [capsuleList]);

  useEffect(() => {
    console.log(pauseAnimation);

  }, [pauseAnimation]);

  // Generate a unique key based on themeStyles or other dynamic properties
  const itemMomentMultiKey = `item-moment-multi-${themeStyles.friendFocusSectionIcon.color}`;

  const renderAdditionalSatellites = useCallback(() => {
    return (
      <FlashList
        data={allItems}
        horizontal
        keyExtractor={(item, index) => `additional-satellite-${index}`}
        renderItem={({ item }) => (
          <View style={{paddingRight: 20 }}>
            <ItemMomentSingle momentObject={item} momentWidth={240} momentHeight={240}/>
          </View>
        )}
        estimatedItemSize={250}  
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        ListFooterComponent={<View style={{ width: 76 }} />}
      />
    );
  }, [allItems, onViewableItemsChanged]);

  return (
    <View style={styles.container}>
      {!additionalPages && ( 
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { height: buttonHeight, width:'100%' }]}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: buttonHeight, 
                  borderRadius: buttonRadius,
                  alignItems: 'center',
                  overflow: 'hidden', 
                }} 
              > 
                <View style={[styles.mainSection, {height: buttonHeight, width: '100%', borderRadius: buttonRadius }]}>
                  <Text style={styles.categoryText}>{headerText}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {isCapsuleListReady && (
                        <View style={{flex: 1}}> 
                          <ItemMomentMulti 
                            key={itemMomentMultiKey} 
                            width={50} 
                            height={50} 
                            containerWidth={300} 
                            limit={4} 
                            horizontal={true} 
                            singleLineScroll={true} 
                            newestFirst={true}
                            pauseAnimation={pauseAnimation}
                          /> 
                        </View>
                     )}
                    </View> 
                </View>
              </View>
            </View> 
          </View> 
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, {height: buttonHeight, borderRadius: buttonRadius }]}>
          {additionalPagesCategorize && (
            <Text style={styles.categoryText}>Category: {category}</Text>
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
  mainSection: {
    flexDirection: 'column',
    paddingHorizontal: 18,
    paddingVertical: 0,   
  }, 
  additionalSatelliteSection: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 13.5,  
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  categoryText: {
    fontSize: 14, 
    color: 'white',
    fontFamily: 'Poppins-Bold', 
    textTransform: 'uppercase',
    overflow: 'hidden',
    maxHeight: 20,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

export default ButtonLottieAnimationSatellitesMoments;