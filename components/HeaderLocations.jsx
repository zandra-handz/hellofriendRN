import React from 'react'; 
import { useLocationList } from '../context/LocationListContext';
import HeaderBaseWithSearch from '../components/HeaderBaseWithSearch';
 

const HeaderLocations = () => {

        const { locationList } = useLocationList();

        return(
            <> 
            {locationList && ( 
            <HeaderBaseWithSearch headerTitle="Locations" componentData={locationList} dataFieldToSearch={'title'} />
            )}
            </>
        );

};

export default HeaderLocations;