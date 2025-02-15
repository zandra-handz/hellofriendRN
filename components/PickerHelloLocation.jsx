import React from 'react';

 import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import PickerComplexList from '../components/PickerComplexList';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const PickerHelloLocation = ({

    selectedLocation, 
    faveLocations=[],
    savedLocations=[],
    modalVisible,
    setModalVisible,
    onLocationChange, 
    buttonRadius=10,
    buttonHeight='auto'

    }) => { 
        
    const { themeStyles } = useGlobalStyle();
    const { friendDataDashboard } = useSelectedFriend();
  



    return (
        <> 
       
        <PickerComplexList 
        title={'PICK LOCATION'}
            containerText={
            <LocationSolidSvg width={20} height={20} color={themeStyles.genericText.color} />}
            inline={true}
            modalHeader='Select Location'
            allowCustomEntry={true}
            primaryOptions={faveLocations}
            primaryOptionsHeader='Pinned'
            primaryIcon={LocationHeartSolidSvg}
            secondaryOptions={savedLocations}
            secondaryOptionsHeader='All Saved'
            secondaryIcon={LocationSolidSvg}
            objects={true} 
            onLabelChange={onLocationChange}
            label={selectedLocation}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}  
            buttonHeight={buttonHeight}
        /> 
        </>
    );
};


export default PickerHelloLocation;

