import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import ItemViewLocation from '../components/ItemViewLocation';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext';
import { FlashList } from "@shopify/flash-list";
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import LocationHeartOutlineSvg from '../assets/svgs/location-heart-outline.svg';


const windowWidth = Dimensions.get('window').width;

const ItemLocationMulti = ({
    locationData,
    horizontal = true,
    singleLineScroll = true,
    width = 200,
    height = 200,
    columns = 5,
    limit,
    newestFirst = true,
    showBigSvg = false,
}) => {
    const { locationList, faveLocationList, tempLocationList, savedLocationList } = useLocationList();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const sortedLocations = locationList.sort((a, b) => {
        return newestFirst ? new Date(b.created) - new Date(a.created) : new Date(a.created) - new Date(b.created);
    });
    const [locations, setLocations] = useState(sortedLocations.slice(0, limit)); 
    
    useEffect(() => {
        console.log('Total number of locations:', locations.length);
    }, [locations.length]);  

    const openModal = (location) => {
        console.log('Opening modal for location:', location);
        setSelectedLocation(location);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setSelectedLocation(null);
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>

            {faveLocationList && (
                <View> 
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Pinned</Text>
                    </View>
                    <FlashList
                        data={faveLocationList}
                        horizontal={horizontal && singleLineScroll}
                        keyExtractor={(location) => location.id.toString()}
                        renderItem={({ item: location }) => (
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
                        )}
                        numColumns={horizontal && !singleLineScroll ? columns : 1}
                        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                        contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
                        estimatedItemSize={99}
                    />
                </View>
            )}

            {savedLocationList && (
                <View>
                    <Text style={styles.headerText}>Saved</Text>
                    <FlashList
                        data={savedLocationList}
                        horizontal={horizontal && singleLineScroll}
                        keyExtractor={(location) => location.id.toString()}
                        renderItem={({ item: location }) => (
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
                        numColumns={horizontal && !singleLineScroll ? columns : 1}
                        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                        contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
                        estimatedItemSize={99}
                    />
                </View>
            )}

            {tempLocationList && (
                <View> 
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Recently viewed</Text>
                    </View>
                    <FlashList
                        data={tempLocationList}
                        horizontal={horizontal && singleLineScroll}
                        keyExtractor={(location) => location.id.toString()}
                        renderItem={({ item: location }) => (
                            <CardMicroLocation
                                location={location}
                                width={width}
                                height={height}
                                showBigSvg={showBigSvg}
                                onPress={() => openModal(location)}
                                SvgComponent={LocationOutlineSvg}
                            />
                        )}
                        numColumns={horizontal && !singleLineScroll ? columns : 1}
                        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                        contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
                        estimatedItemSize={99}
                    />
                </View>
            )}

            <Modal visible={isModalVisible} onRequestClose={closeModal} transparent>
                <View style={styles.modalContainer}>
                    <ItemViewLocation location={selectedLocation} onClose={closeModal} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
    },
    headerText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginVertical: 12,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageRow: {
        justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default ItemLocationMulti;
