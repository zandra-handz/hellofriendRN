import React, { useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet, FlatList, Animated } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { FlashList } from '@shopify/flash-list';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import ShopOutlineSvg from '../assets/svgs/shop-outline.svg';

import LocationCard from "../components/LocationCard";
import { LinearTransition } from 'react-native-reanimated';
 
const LocationsFriendFavesList = ({  
    locationList, 
    addToFavoritesFunction, 
    removeFromFavoritesFunction, 
    scrollTo,
}) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();  

 
        const flatListRef = useRef(null);
    
        const ITEM_HEIGHT = 170;
        const ITEM_BOTTOM_MARGIN = 6;
        const COMBINED = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;
    
    const momentListBottomSpacer = Dimensions.get("screen").height - 200;


    const scrollToLocationId = (locationId) => {
        const index = locationList.findIndex((location) => location.id === locationId);
        console.log(index);
        if (index !== -1) {
            flatListRef.current?.scrollToIndex({
                index,
                animated: true,
            });
        }
    };

    useEffect(() => {
        if (scrollTo) {
            setTimeout(() => {
                scrollToLocationId(scrollTo);
                console.log('scrollFavesTo:', scrollTo);
            }, 0); // Delay of 100ms
        }
    }, [scrollTo]);
    
    
 


    return (
        <View style={[styles.container]}>
            {locationList && locationList.length > 0 && (
            <>
            <Animated.FlatList
                ref={flatListRef}
                data={locationList}
                horizontal={false}
                keyExtractor={(location) => location.id.toString()}
                getItemLayout={(data, index) => ({
                    length: ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
                    offset: (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN) * index,
                    index,
                  })}
                renderItem={({ item: location }) => ( 
                    <LocationCard
                    addToFavorites={addToFavoritesFunction}
                    removeFromFavorites={removeFromFavoritesFunction}
                    height={ITEM_HEIGHT}
                    bottomMargin={ITEM_BOTTOM_MARGIN}
                        location={location} 
                        favorite={true}    
                        iconColor={themeAheadOfLoading.lightColor}
                        //color={themeStyles.genericText.color}
                                      //iconColor={themeStyles.genericText.color}
                                      color={themeStyles.genericText.color}
                                      icon={ShopOutlineSvg}
                                      iconSize={25} />
                         
                        
                    
                )}
                numColumns={1}
                columnWrapperStyle={ null}
                estimatedItemSize={COMBINED}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
                onScrollToIndexFailed={(info) => {
                    flatListRef.current?.scrollToOffset({
                        offset: info.averageItemLength * info.index,
                        animated: true,
                    });
                }}
                snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN} // Set the snapping interval to the height of each item
                snapToAlignment="start" // Align items to the top of the list when snapped
                decelerationRate="fast" // Optional: makes the scroll feel snappier
            
                          ListFooterComponent={() => (
                            <View style={{ height: momentListBottomSpacer }} />
                          )}
                          keyboardDismissMode="on-drag"
                          itemLayoutAnimation={LinearTransition}
            />


            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "4%",
        backgroundColor: "transparent",
        width: "100%",
        minHeight: 2,
        flex: 1,
      },
    headerText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginTop: 4,
        marginBottom: 6,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageRow: {
        justifyContent: 'space-between',
    }, 
});

export default LocationsFriendFavesList;
