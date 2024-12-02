import React from 'react'; 
import HeaderBaseButtonComponent  from '../components/HeaderBaseButtonComponent';
import LocationSavingActions from '../components/LocationSavingActions';

const HeaderLocationSingle = ({location, favorite}) => {
    
 
        const title = location && location.title ? location.title : "VIEW LOCATION";


        return(
            <>  
            <HeaderBaseButtonComponent 
                headerTitle={typeof title === 'string' ? title : `${title}`}  
                buttonComponent={<LocationSavingActions location={location} favorite={favorite}/>} 
                />
            </>
        );

};

export default HeaderLocationSingle;