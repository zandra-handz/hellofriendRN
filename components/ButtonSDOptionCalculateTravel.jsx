import React, { useState } from 'react';  
 import { View, Text } from 'react-native';
import ButtonBaseSDOption from '../components/ButtonBaseSDOption';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 

import ItemModal from '../components/ItemModal';
 
import { useFriendList } from '../context/FriendListContext';

const ButtonSDOptionCalculateTravel = () => {

    const { themeAheadOfLoading } = useFriendList(); 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    return(
        <>
        <ButtonBaseSDOption 
            onPress={openModal} 
            icon={DistanceDottedSvg}
            iconColor={themeAheadOfLoading.fontColor}
            iconSize={32}
        />

        <ItemModal
            isModalVisible={isModalVisible} 
            toggleModal={closeModal} 
            modalContent={<View><Text>REMOVED OLD COMPARE TRAVEL COMPONENT THAT WAS HERE</Text></View>}
            modalTitle={'Compare travel times'}
        > 
        </ItemModal> 
      </>

    );
};

export default ButtonSDOptionCalculateTravel;
