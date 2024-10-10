import React from 'react'; 
import { useLocationList } from '../context/LocationListContext';
import HeaderBaseButtonComponent  from '../components/HeaderBaseButtonComponent';
import ButtonSaveLocation from '../components/ButtonSaveLocation';

const HeaderLocationSingle = () => {
    

    const { selectedLocation, additionalDetails, loadingAdditionalDetails, updateAdditionalDetails } = useLocationList();
  
        const title = additionalDetails?.name || (selectedLocation && selectedLocation.title ? selectedLocation.title : "Location not available");


        return(
            <> 
            {selectedLocation && ( 
            <HeaderBaseButtonComponent headerTitle={`${title}`}  buttonComponent={ButtonSaveLocation} />
            )}
            </>
        );

};

export default HeaderLocationSingle;