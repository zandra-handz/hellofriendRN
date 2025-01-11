import React, { useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { FlashList } from '@shopify/flash-list';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';

import ButtonLocation from '../components/ButtonLocation';  

const LocationsFriendFavesList = ({  
    locationList, 
    scrollTo,
}) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();  

 
        const flatListRef = useRef(null);
    
        const ITEM_HEIGHT = 100;
        const ITEM_BOTTOM_MARGIN = 6;
    
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
            <FlashList
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
                    <ButtonLocation 
                    height={ITEM_HEIGHT}
                    bottomMargin={ITEM_BOTTOM_MARGIN}
                        location={location} 
                        favorite={true}    
                        iconColor={themeAheadOfLoading.darkColor}
                        color={themeStyles.genericText.color}
                        icon={LocationHeartSolidSvg} />
                         
                        
                    
                )}
                numColumns={1}
                columnWrapperStyle={ null}
                estimatedItemSize={106}
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
