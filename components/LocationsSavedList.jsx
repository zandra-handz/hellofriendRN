import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LocationSolidSvg from '../assets/svgs/location-solid.svg'; 
import ButtonLocation from '../components/ButtonLocation'; 

const LocationsSavedList = ({ 
    locationList,  
    scrollTo,
}) => {  
    const { themeStyles } = useGlobalStyle();

    const flatListRef = useRef(null);

    const ITEM_HEIGHT = 100;
const ITEM_BOTTOM_MARGIN = 0; 

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
    console.log('locationSavedList rerendered');
}, []);

useEffect(() => {
    if (scrollTo) {
        setTimeout(() => {
            scrollToLocationId(scrollTo);
            console.log('scrollTo:', scrollTo);
        }, 0); // Delay of 100ms
    }
}, [scrollTo]);

    return (
        <View style={[styles.container, {height: '100%'}]}> 
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
                                location={location}  iconColor={themeStyles.genericText.color}
                                color={themeStyles.genericText.color}
                                icon={LocationSolidSvg} 
                            />  
                )}
                numColumns={1}
                columnWrapperStyle={ null}
                estimatedItemSize={99}
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
 

        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        paddingHorizontal: 2,
        backgroundColor: 'transparent',
        width: '100%',
        minHeight: 2,
        height: '100%',
    },
    headerText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginTop: 4,
        marginBottom: 6,
    },
    imageRow: {
        justifyContent: 'space-between',
    }, 
});

export default LocationsSavedList;
