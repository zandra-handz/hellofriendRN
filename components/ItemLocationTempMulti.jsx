import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext';
import { FlashList } from "@shopify/flash-list";
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import ItemViewLocation from '../components/ItemViewLocation';
import ButtonLocation from '../components/ButtonLocation'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';


const ItemLocationTempMulti = ({ 
    horizontal = true,
    singleLineScroll = true,
    width = 70,
    height = 70,
    containerHeight = 80,
    columns = 3, 
    showBigSvg = false,
}) => {
    const { tempLocationList } = useLocationList();
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
        <View style={[styles.container]}>

            <Text style={[styles.headerText, themeStyles.subHeaderText]}>Recently viewed</Text>
            
            {tempLocationList.length > 0 && (
            <>   

            <FlashList
                data={tempLocationList}
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
                        SvgComponent={LocationOutlineSvg}
                    />
                    )}
                        {!horizontal && (
                        <ButtonLocation 
                            location={location} 
                            onPress={() => openModal(location)}  
                            icon={LocationOutlineSvg} />

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
            </>
            )}

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
        height: '100%',
    },
    headerText: { 
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
        width: '100%',
    }, 
});

export default ItemLocationTempMulti;
