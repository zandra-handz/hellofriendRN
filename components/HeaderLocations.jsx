import React, { useEffect, useLayoutEffect } from 'react'; 
import { View } from 'react-native';
import useLocationFunctions from '../hooks/useLocationFunctions';
import HeaderBaseWithSearch from '../components/HeaderBaseWithSearch';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

 


const HeaderLocations = () => {

        const { locationList, accessLocationListCacheData } = useLocationFunctions();
        const navigation = useNavigation();
        const queryClient = useQueryClient();

        const handleGoToLocationViewScreen = (location) => { 
            if (location) {

           
            navigation.navigate('Location', { location: location });
             }
          }; 



          const locationsCache = accessLocationListCacheData();



useLayoutEffect(() => { 
        console.log(locationList);
        const locationsCache = accessLocationListCacheData();
        console.log('LOCATION CACHE', locationsCache);
        
 
}, []);



        const handlePress = (item) => {
            handleGoToLocationViewScreen(item);


        };




        return(
            <View style={{zIndex: 1000, overflow: 'visible'}}> 
            {locationList && ( 
            <HeaderBaseWithSearch headerTitle="Locations" onPress={handlePress} componentData={locationsCache} dataFieldToSearch={['title', 'address']} />
            )}
            </View>
        );

};

export default HeaderLocations;