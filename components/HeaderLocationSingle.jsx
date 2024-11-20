import React from 'react'; 
import HeaderBaseButtonComponent  from '../components/HeaderBaseButtonComponent';
import ButtonSaveLocation from '../components/ButtonSaveLocation';

const HeaderLocationSingle = ({location}) => {
    
 
        const title = location && location.title ? location.title : "VIEW LOCATION";


        return(
            <>  
            <HeaderBaseButtonComponent 
                headerTitle={typeof title === 'string' ? title : `${title}`}  
                buttonComponent={<ButtonSaveLocation location={location}/>} 
                />
            </>
        );

};

export default HeaderLocationSingle;