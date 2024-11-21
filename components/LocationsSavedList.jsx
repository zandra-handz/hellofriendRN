import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LocationSolidSvg from '../assets/svgs/location-solid.svg'; 
import ButtonLocation from '../components/ButtonLocation'; 

const LocationsSavedList = ({ 
    locationList,  
}) => {  
    const { themeStyles } = useGlobalStyle();

    return (
        <View style={[styles.container, {height: '100%'}]}>
            <Text style={[styles.headerText, themeStyles.genericText]}>Saved</Text>
            <FlashList
                data={locationList}
                horizontal={false}
                keyExtractor={(location) => location.id.toString()}
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
