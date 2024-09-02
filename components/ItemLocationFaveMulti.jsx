import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext';
import { FlashList } from "@shopify/flash-list";
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import ItemViewLocation from '../components/ItemViewLocation';

const ItemLocationFaveMulti = ({ 
    horizontal = true,
    singleLineScroll = false,
    width = 70,
    height = 70,
    columns = 4, 
    showBigSvg = false,
}) => {
    const { faveLocationList } = useLocationList();
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
        <View style={styles.container}>
            <Text style={styles.headerText}>Pinned</Text>
            <FlashList
                data={faveLocationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <View style={{marginRight: 20}}>
                    <CardMicroLocation
                        location={location}
                        width={width}
                        height={height}
                        showBigSvg={showBigSvg}
                        onPress={() => openModal(location)}
                        SvgComponent={LocationHeartSolidSvg}
                        iconColor={'pink'}
                        colorScheme={'pink'}
                    />
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
        width: '100%',
        paddingHorizontal: 2,
        backgroundColor: 'transparent',
        minHeight: 2,
        height: 150,
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

export default ItemLocationFaveMulti;
