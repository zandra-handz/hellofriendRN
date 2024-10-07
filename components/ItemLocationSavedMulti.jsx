import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext';
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';
import ItemViewLocation from '../components/ItemViewLocation';
import ButtonLocation from '../components/ButtonLocation';
import SearchBar from '../components/SearchBar';

const ItemLocationSavedMulti = ({ 
    horizontal = true,
    singleLineScroll = false,
    titleColor = 'black',
    width = 70,
    height = 70,
    columns = 3, 
    showBigSvg = false,
    containerHeight = 220, 

}) => {
    const { savedLocationList } = useLocationList();
    const { themeStyles } = useGlobalStyle();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
   

    const openModal = (location) => {
        setSelectedLocation(location);
        setIsModalVisible(true);
    };

    const closeModal = () => { 
        setSelectedLocation(null);
        setIsModalVisible(false);
    };

    return (
        <View style={[styles.container, {height: containerHeight}]}>
            <Text style={[styles.headerText, themeStyles.genericText]}>Saved</Text>
            <FlashList
                data={savedLocationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <View style={{marginRight: 20}}>
                    {horizontal && ( 
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
                    )}
                    {!horizontal && (
                        <ButtonLocation 
                            location={location} 
                            onPress={() => openModal(location)} 
                            textColor={titleColor}
                            iconColor={titleColor}
                            icon={LocationSolidSvg} />

                    )}
                    </View>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                estimatedItemSize={99}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
            />

            {isModalVisible && (
                <ItemViewLocation location={selectedLocation} onClose={closeModal} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        paddingHorizontal: 2,
        backgroundColor: 'transparent',
        width: '100%',
        minHeight: 2,
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

export default ItemLocationSavedMulti;
