import React from 'react'; 
import HeaderBaseButtonComponent  from '../components/HeaderBaseButtonComponent';
import ButtonSaveLocation from '../components/ButtonSaveLocation';

const HeaderLocationSingle = ({location, favorite}) => {
    
 
        const title = location && location.title ? location.title : "VIEW LOCATION";


        return(
            <>  
            <HeaderBaseButtonComponent 
                headerTitle={typeof title === 'string' ? title : `${title}`}  
                buttonComponent={<ButtonSaveLocation location={location} favorite={favorite}/>} 
                />
            </>
        );

};

export default HeaderLocationSingle;