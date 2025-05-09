import React, { useEffect,  useRef } from 'react';
import { View, Dimensions, StyleSheet,  Animated } from 'react-native'; 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList } from '@/src/context/FriendListContext'; 
import ShopOutlineSvg from '@/app/assets/svgs/shop-outline.svg'; 
import LocationCard from "./LocationCard";
import { LinearTransition } from 'react-native-reanimated';
import { useLocations } from '@/src/context/LocationsContext';
 
const LocationsFriendFavesList = ({  
    faveLocationList,
    addToFavoritesFunction, 
    removeFromFavoritesFunction, 
    scrollTo,
}) => {
    const { locationList } = useLocations();
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();   
 
 
        const flatListRef = useRef(null);
    
        const ITEM_HEIGHT = 170;
        const ITEM_BOTTOM_MARGIN = 6;
        const COMBINED = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;
    
    const momentListBottomSpacer = Dimensions.get("screen").height - 200;


    const scrollToLocationId = (locationId) => {
        const index = faveLocationList.findIndex((location) => location.id === locationId);
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

    //   useEffect(() => {
    //     console.log('use effect for fave locations triggered');
    //     if (locationList && friendFavesData && friendFavesData.friendFaveLocations ) { 
    //       const data = friendFavesData.friendFaveLocations;
    //       if (data) {
    //       const faveLocations = locationList.filter((location) => data.includes(location.id));
    //       console.log(`fave locations: `, faveLocations);
    //       setFaveLocationList(faveLocations);
            
    //     } else {
    //         const faveLocations = [];
    //         console.log(`fave locations: `, faveLocations);
    //       setFaveLocationList(faveLocations);


    //     }
          
        
    
    //     }
    //   }, [locationList, friendFavesData]);
    
    
 


    return (
        <View style={[styles.container]}>
            {locationList && faveLocationList && locationList.length > 0 && (
            <>
            <Animated.FlatList
                ref={flatListRef}
                data={faveLocationList}
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
