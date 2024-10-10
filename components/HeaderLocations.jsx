import React from 'react'; 
import { useLocationList } from '../context/LocationListContext';
import HeaderBaseWithSearch from '../components/HeaderBaseWithSearch';
import { useNavigation } from '@react-navigation/native';


const HeaderLocations = () => {

        const { locationList, selectedLocation, setSelectedLocation } = useLocationList();
        const navigation = useNavigation();

        const handleGoToLocationViewScreen = (location) => { 
            if (selectedLocation) {

           
            navigation.navigate('Location', { location: location });
             }
          }; 



        const handlePress = (item) => {
            console.log(item);

            //const locationMatch = locationList.filter(location => 
             //   location.id === item.id // Adjust this comparison based on your property
            //);

            //console.log(locationMatch);
            setSelectedLocation(item);
            console.log('attempting to set location from header locations...');
            handleGoToLocationViewScreen(item);


        };




        return(
            <> 
            {locationList && ( 
            <HeaderBaseWithSearch headerTitle="Locations" onPress={handlePress} componentData={locationList} dataFieldToSearch={'title'} />
            )}
            </>
        );

};

export default HeaderLocations;