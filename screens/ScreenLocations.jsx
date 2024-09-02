import React, { useState, useEffect } from 'react';
import { View,  StyleSheet } from 'react-native';

import ButtonSearchGoogleMap from '../components/ButtonSearchGoogleMap';
import ButtonFindMidpoints from '../components/ButtonFindMidpoints';

import ItemLocationFaveMulti from '../components/ItemLocationFaveMulti';

import ItemLocationSavedMulti from '../components/ItemLocationSavedMulti';
import ItemLocationTempMulti from '../components/ItemLocationTempMulti';

 
import { useLocationList } from '../context/LocationListContext';

             
const ScreenLocations = ({ route, navigation}) => {


    const { locationList } = useLocationList();
    const [isLocationListReady, setIsLocationListReady] = useState(false);

    const navigateToLocationSearchScreen = () => {
        navigation.navigate('LocationSearch');

    };




    useEffect(() => {
        if (locationList.length > 0) {
            setIsLocationListReady(true);
        }
    }, [locationList]);

    return ( 
        <View style={styles.container}>
            <View style={styles.scrollViewContainer}>
               
                    {isLocationListReady && (
                        <>  
                        <View style={styles.recentlyViewedContainer}>
                            <ItemLocationTempMulti />
                        </View>
                        <View style={styles.sectionContainer}>
                            <ItemLocationFaveMulti />
                        </View> 
                        <View style={styles.sectionContainer}>
                            <ItemLocationSavedMulti />
                        </View> 
                        </>

                    )}  
            </View>
                <View style={styles.bottomContainer}> 
                        <ButtonSearchGoogleMap onPress={navigateToLocationSearchScreen} />  
                        <ButtonFindMidpoints /> 
                </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        height: '78%',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 28,
        paddingBottom: 9,
        justifyContent: 'space-between',
    },  
    recentlyViewedContainer: {
        width: '100%', 
        borderRadius: 30, 
        padding: 10,

    },
    sectionContainer: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: 'black',
        padding: 10,

    },
    
    bottomContainer: {
        height: '22%',
        width: '100%',
        padding: 10,
        paddingTop: 20, 
        flexDirection: 'column', 
        justifyContent: 'space-evenly',
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
    
      },
});

export default ScreenLocations;
