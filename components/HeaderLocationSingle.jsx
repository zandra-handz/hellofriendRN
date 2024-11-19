import React from 'react'; 
import useLocationFunctions from '../hooks/useLocationFunctions';
import HeaderBaseButtonComponent  from '../components/HeaderBaseButtonComponent';
import ButtonSaveLocation from '../components/ButtonSaveLocation';

const HeaderLocationSingle = ({location}) => {
    

    const { selectedLocation, additionalDetails } = useLocationFunctions();
  
        const title = location && location.title ? selectedLocation.title : "VIEW LOCATION";


        return(
            <>  
            <HeaderBaseButtonComponent headerTitle={`${title}`}  buttonComponent={ButtonSaveLocation} />
    
            </>
        );

};

export default HeaderLocationSingle;