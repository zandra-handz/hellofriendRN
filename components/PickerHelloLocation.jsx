import React, { useState, useEffect } from 'react';


import { useSelectedFriend } from '../context/SelectedFriendContext';

import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import LocationSolidSvg from '../assets/svgs/location-solid.svg';


import PickerComplexList from '../components/PickerComplexList';

import { useLocationList } from '../context/LocationListContext';


const PickerHelloLocation = ({

    selectedLocation, 
    onLocationChange

    }) => {

    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const { locationList, faveLocationList,populateFaveLocationsList, savedLocationList } = useLocationList();
    const [isLocationListReady, setIsLocationListReady] = useState(false);
    const { friendDashboardData, loadingNewFriend } = useSelectedFriend();

        useEffect(() => {
            if (friendDashboardData && friendDashboardData.length > 0) {
                const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];

                console.log('favorite location IDs: ', favoriteLocationIds);
                populateFaveLocationsList(favoriteLocationIds);

            }
        }, [locationList, friendDashboardData]);


    useEffect(() => {
        if (locationList.length > 0 && !loadingNewFriend) {
            setIsLocationListReady(true); 
        } else {
          setIsLocationListReady(false)
        };
      }, [loadingNewFriend, locationList]);

    return (
        <> 
        {isLocationListReady && (
        <PickerComplexList 
            containerText='Location: '
            inline={true}
            modalHeader='Select Location'
            allowCustomEntry={true}
            primaryOptions={faveLocationList}
            primaryOptionsHeader='Pinned'
            primaryIcon={LocationHeartSolidSvg}
            secondaryOptions={savedLocationList}
            secondaryOptionsHeader='All Saved'
            secondaryIcon={LocationSolidSvg}
            objects={true} 
            onLabelChange={onLocationChange}
            label={selectedLocation}
            modalVisible={locationModalVisible}
            setModalVisible={setLocationModalVisible} 
        />
        )}
        </>
    );
};


export default PickerHelloLocation;

