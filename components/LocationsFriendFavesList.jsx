import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
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
    const { friendDashboardData } = useSelectedFriend();


    const filterLocations = () => {
        const favoriteLocations = locations.filter(location => friendDashboardData[0].friend_faves.locations.includes(location.id));
        console.log('NEW FILTER FUNCTION');
        return favoriteLocations;
    };

    //const faveLocations = filterLocations();
 


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
                        favorite={true}    
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
