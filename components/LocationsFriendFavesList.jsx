import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { FlashList } from '@shopify/flash-list';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';

import ButtonLocation from '../components/ButtonLocation';  

const LocationsFriendFavesList = ({  
    locations, 
}) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList(); 
 


  

    return (
        <View style={[styles.container]}>
            {locations && locations.length > 0 && (
            <>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>Favorites</Text>
            <FlashList
                data={locations}
                horizontal={false}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                     
                    <ButtonLocation 
                        location={location}     
                        iconColor={themeAheadOfLoading.darkColor}
                        color={themeStyles.genericText.color}
                        icon={LocationHeartSolidSvg} />
                    
                )}
                numColumns={1}
                columnWrapperStyle={null}
                estimatedItemSize={99}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
            />


            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {  
        width: '100%',
        paddingHorizontal: 2, 
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
