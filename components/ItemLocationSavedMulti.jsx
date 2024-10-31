import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext'; 
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LocationSolidSvg from '../assets/svgs/location-solid.svg'; 
import ButtonLocation from '../components/ButtonLocation'; 

const ItemLocationSavedMulti = ({ 
    horizontal = true,
    singleLineScroll = false, 
    width = 70,
    height = 70,
    columns = 3, 
    showBigSvg = false, 
}) => { 
    const { locationList, savedLocationList } = useLocationList();
    const { themeStyles } = useGlobalStyle();
    const [selectedLocation, setSelectedLocation] = useState(null);
   
    const openModal = (location) => {
        setSelectedLocation(location);
        console.log('setting location in ItemLocationSavedMulti'); 
    };
 

    return (
        <View style={[styles.container, {height: '100%'}]}>
            <Text style={[styles.headerText, themeStyles.genericText]}>Saved</Text>
            <FlashList
                data={locationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <>
                        {horizontal ? (
                            <CardMicroLocation
                                location={location}
                                width={width}
                                height={height}
                                showBigSvg={showBigSvg}
                                onPress={() => openModal(location)}
                                SvgComponent={LocationSolidSvg}
                                iconColor={'lightblue'}
                                colorScheme={'green'}
                            />
                        ) : (
                            <ButtonLocation 
                                location={location} 
                                onPress={() => openModal(location)} 
                                iconColor={themeStyles.genericText.color}
                                color={themeStyles.genericText.color}
                                icon={LocationSolidSvg} 
                            />
                        )}
                    </>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                estimatedItemSize={99}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
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

export default ItemLocationSavedMulti;
