import React, { useState } from 'react';  

import CompareTravel from '../components/CompareTravel';

import ButtonBaseSDOption from '../components/ButtonBaseSDOption';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 

import AlertImage from '../components/AlertImage';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';



const ButtonSDOptionCalculateTravel = () => {

    const { calculatedThemeColors } = useSelectedFriend(); 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    return(
        <>
        <ButtonBaseSDOption 
            onPress={openModal} 
            icon={DistanceDottedSvg}
            iconColor={calculatedThemeColors.fontColor}
            iconSize={32}
        />

        <AlertImage
            isModalVisible={isModalVisible} 
            toggleModal={closeModal} 
            modalContent={<CompareTravel/>}
            modalTitle={'Compare travel times'}
        > 
        </AlertImage> 
      </>

    );
};

export default ButtonSDOptionCalculateTravel;
