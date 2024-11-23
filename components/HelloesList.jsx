import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
 import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';  
import ButtonHello from '../components/ButtonHello';

const HelloesList = ({ 
    helloesData,
    onPress, 
    horizontal = true,
    singleLineScroll = false,  
    columns = 3,  
}) => {  
    const { themeStyles } = useGlobalStyle();
    const [selectedLocation, setSelectedLocation] = useState(null);
   
    const openModal = (location) => {
        setSelectedLocation(location);
        console.log('setting location in ItemLocationSavedMulti'); 
    };
 

    return (
        <View style={[styles.container, {height: '100%'}]}>
            <Text style={[styles.headerText, themeStyles.genericText]}>Helloes</Text>
            <FlashList
                data={helloesData}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(hello) => hello.id.toString()}
                renderItem={({ item: hello }) => (
                    <>
                        {horizontal ? (
                            <ButtonHello
                                hello={hello} 
                                onPress={() => {onPress(hello)}} 
                                iconColor={themeStyles.genericText.color}
                                color={themeStyles.genericText.color}
                                icon={LocationSolidSvg} 
                            />
                             
                        ) : (
                            <ButtonHello
                                hello={hello} 
                                onPress={() => {onPress(hello)}} 
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

export default HelloesList;
